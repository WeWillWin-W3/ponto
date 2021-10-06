CREATE FUNCTION get_date_daterangebit(d date) RETURNS bit(7) AS
    $$ SELECT B'1000000' >> extract(dow from d)::INTEGER; $$
LANGUAGE SQL IMMUTABLE
RETURNS NULL ON NULL INPUT;

CREATE FUNCTION date_is_in_daterangebit(d date, r bit(7)) RETURNS boolean AS 
    $$ SELECT (get_date_daterangebit(d) & r) > 0::bit(7)$$
LANGUAGE SQL IMMUTABLE
RETURNS NULL ON NULL INPUT;

CREATE FUNCTION abs(interval) RETURNS interval AS
  $$ SELECT CASE WHEN ($1<interval '0') THEN -$1 ELSE $1 END; $$
LANGUAGE SQL IMMUTABLE;

CREATE FUNCTION get_one_bits_num(r bit(7)) RETURNS interval AS
    $$ SELECT length(regexp_replace(r::text, '[^1]', '', 'g')); $$
LANGUAGE SQL IMMUTABLE
RETURNS NULL ON NULL INPUT;

CREATE VIEW "UnscheduledAttendance" AS
    SELECT a.* FROM "Attendance" as a
    WHERE NOT EXISTS (
        SELECT TRUE FROM "WorkScheduleEmployee" as wse
        JOIN "WorkSchedule" as ws ON ws.id = wse."workSchedule"
        JOIN "WorkScheduleTimeRange" as wstr ON wstr."workSchedule" = ws.id
        JOIN "TimeRange" as tr ON tr.id = wstr."timeRange"
        WHERE wse.employee = a.employee AND ws.workable = TRUE 
            AND ((a.time::time BETWEEN tr.start AND tr.end) AND date_is_in_daterangebit(a.time::date, wstr."repeatDays")));

-- Attendance intervals
WITH ordered_attendances AS (
	SELECT row_number() OVER (PARTITION BY employee ORDER BY employee, time
) - 1 AS i, * FROM "Attendance" ORDER BY employee, time)
SELECT da.id AS start_id, da.time AS start, da2.id AS end_id, da2.time AS end, da.employee FROM ordered_attendances as da
JOIN ordered_attendances da2 ON da2.i-1 = da.i AND da2.employee = da.employee
WHERE da.i % 2 = 0;

-- Employee TimeRanges
SELECT wse.employee, ws.workable, wstr."repeatDays", tr.start, tr.end 
FROM "WorkScheduleEmployee" as wse 
JOIN "WorkSchedule" as ws ON ws.id = wse."workSchedule"
JOIN "WorkScheduleTimeRange" as wstr ON wstr."workSchedule" = ws.id
JOIN "TimeRange" as tr ON tr.id = wstr."timeRange"
ORDER BY wse.employee;

-- Get closest TimeRange by attendance pair
CREATE VIEW "MatchingTimeRangeByAttendancePair" AS (
	WITH employee_timeranges AS (
		SELECT wse.employee, ws.workable, ws.description, wstr."repeatDays", tr.* FROM "WorkScheduleEmployee" as wse 
		JOIN "WorkSchedule" as ws ON ws.id = wse."workSchedule"
		JOIN "WorkScheduleTimeRange" as wstr ON wstr."workSchedule" = ws.id
		JOIN "TimeRange" as tr ON tr.id = wstr."timeRange"
		ORDER BY wse.employee
	)
	SELECT inner_table.employee, start_attendance, start_attendance_time, end_attendance, end_attendance_time,  
	matching_timerange, workable as timerange_workable, description AS timerange_workschedule_description, 
	"repeatDays" as timerange_workschedule_repeat_days, "start" as timerange_start, "end" as timerange_end 
	FROM (
		WITH ordered_attendances AS (
			SELECT row_number() OVER (PARTITION BY employee ORDER BY employee, time) - 1 AS i, * FROM "Attendance" AS a
			ORDER BY employee, time
		)
		SELECT oa.id AS start_attendance, oa.time AS start_attendance_time, 
		oa2.id AS end_attendance, oa2.time AS end_attendance_time, oa.employee, (
			SELECT et.id
			FROM employee_timeranges AS et
			WHERE date_is_in_daterangebit(oa.time::date, et."repeatDays") OR date_is_in_daterangebit(oa2.time::date, et."repeatDays")
			-- Prefer workable ranges, if exists
			-- ORDER BY et.workable DESC, (ABS(et.start::time - oa.time::time) + ABS(et.end::time - oa2.time::time)) ASC
			ORDER BY (ABS(et.start::time - oa.time::time) + ABS(et.end::time - oa2.time::time)) ASC, et.workable DESC
			LIMIT 1
		) AS matching_timerange FROM ordered_attendances as oa
		JOIN ordered_attendances AS oa2 ON oa2.i-1 = oa.i AND oa2.employee = oa.employee
		WHERE oa.i % 2 = 0
	) AS inner_table
	LEFT JOIN employee_timeranges AS et ON et.id = matching_timerange AND et.employee = inner_table.employee
	ORDER BY inner_table.employee, start_attendance
);

-- Get CompensatoryTime
SELECT worked_hours_acc - matching_timerange_hours_acc AS compensatory_time_acc, 
start_attendance_time + matching_timerange_hours_acc AS compensatory_time_start,
end_attendance_time AS compensatory_time_end,
* FROM (
	SELECT 
		SUM(matching_timerange_hours) OVER (PARTITION BY employee ORDER BY employee, start_attendance) AS matching_timerange_hours_acc,
		SUM(worked_hours) OVER (PARTITION BY employee ORDER BY employee, start_attendance) AS worked_hours_acc, *
	FROM (
		SELECT 
		CASE WHEN timerange_workable THEN ABS(timerange_end - timerange_start) ELSE '0'::interval END AS matching_timerange_hours,
		ABS(end_attendance_time - start_attendance_time) AS worked_hours,
		* FROM "MatchingTimeRangeByAttendancePair"
	) as inner_table
) as inner_table;

-- Get employee work hours by workschedule
SELECT employee, workschedule_id,
SUM(CASE WHEN workable AND date_is_in_daterangebit(day, "repeatDays") THEN inner_table.end - inner_table.start ELSE '0'::interval END) as work_hours
FROM (
 	SELECT wse.employee, ws.workable, wstr."repeatDays", tr.id as timerange_id, tr.start, tr.end, 
	generate_series('2021-08-01'::date, '2021-08-31', '1 day')::date as day, wse."workSchedule" as workschedule_id
	FROM "WorkScheduleEmployee" as wse 
	JOIN "WorkSchedule" as ws ON ws.id = wse."workSchedule"
	JOIN "WorkScheduleTimeRange" as wstr ON wstr."workSchedule" = ws.id
	JOIN "TimeRange" as tr ON tr.id = wstr."timeRange"
	ORDER BY wse.employee
) AS inner_table
GROUP BY employee, workschedule_id;