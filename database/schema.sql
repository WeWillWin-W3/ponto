CREATE TYPE "user_role" AS ENUM (
  'basic',
  'manager',
  'admin'
);

CREATE TYPE "attendance_validator_type" AS ENUM (
  'QRCode'
);

CREATE TABLE "Employee" (
  "id" int PRIMARY KEY,
  "name" varchar NOT NULL,
  "user" int NOT NULL,
  "company" int NOT NULL
);

CREATE TABLE "Attendance" (
  "id" int PRIMARY KEY,
  "time" timestamp NOT NULL,
  "description" varchar,
  "employee" int NOT NULL
);

CREATE TABLE "AttendanceCorrectionRequest" (
  "id" int PRIMARY KEY,
  "time" timestamp,
  "attendance" int,
  "attester" int,
  "accepted" boolean,
  "description" varchar
);

CREATE TABLE "OvertimeWorkApproval" (
  "id" int PRIMARY KEY,
  "start" timestamp NOT NULL,
  "end" timestamp NOT NULL,
  "approver" int NOT NULL
);

CREATE TABLE "ManagerAttendanceSubmission" (
  "attendance" int,
  "manager" int,
  PRIMARY KEY ("attendance", "manager")
);

CREATE TABLE "Company" (
  "id" int PRIMARY KEY,
  "name" varchar NOT NULL
);

CREATE TABLE "User" (
  "id" int PRIMARY KEY,
  "username" varchar NOT NULL,
  "password" varchar NOT NULL,
  "user_role" user_role NOT NULL
);

CREATE TABLE "WorkScheduleEmployee" (
  "work_schedule" int,
  "employee" int,
  PRIMARY KEY ("work_schedule", "employee")
);

CREATE TABLE "WorkSchedule" (
  "id" int PRIMARY KEY,
  "description" varchar,
  "workable" boolean NOT NULL
);

CREATE TABLE "WorkScheduleTimeRange" (
  "work_schedule" int,
  "time_range" int,
  "repeat_days" bit(7) NOT NULL,
  PRIMARY KEY ("work_schedule", "time_range")
);

CREATE TABLE "TimeRange" (
  "id" int PRIMARY KEY,
  "start" time NOT NULL,
  "end" time NOT NULL
);

CREATE TABLE "QRCode" (
  "qrcode_generator" int,
  "attendance_validator" int,
  "public_key" varchar NOT NULL,
  "created_at" timestamp NOT NULL,
  PRIMARY KEY ("qrcode_generator", "attendance_validator")
);

CREATE TABLE "QRCodeGenerator" (
  "id" int PRIMARY KEY,
  "name" varchar,
  "private_key" varchar NOT NULL
);

CREATE TABLE "AttendanceValidatorAttendance" (
  "attendance_validator" int,
  "attendence" int,
  PRIMARY KEY ("attendance_validator", "attendence")
);

CREATE TABLE "AttendanceValidator" (
  "id" int PRIMARY KEY,
  "name" varchar,
  "type" attendance_validator_type NOT NULL
);

ALTER TABLE "Employee" ADD FOREIGN KEY ("user") REFERENCES "User" ("id");

ALTER TABLE "Employee" ADD FOREIGN KEY ("company") REFERENCES "Company" ("id");

ALTER TABLE "Attendance" ADD FOREIGN KEY ("employee") REFERENCES "Employee" ("id");

ALTER TABLE "AttendanceCorrectionRequest" ADD FOREIGN KEY ("attendance") REFERENCES "Attendance" ("id");

ALTER TABLE "AttendanceCorrectionRequest" ADD FOREIGN KEY ("attester") REFERENCES "User" ("id");

ALTER TABLE "OvertimeWorkApproval" ADD FOREIGN KEY ("approver") REFERENCES "User" ("id");

ALTER TABLE "ManagerAttendanceSubmission" ADD FOREIGN KEY ("attendance") REFERENCES "Attendance" ("id");

ALTER TABLE "ManagerAttendanceSubmission" ADD FOREIGN KEY ("manager") REFERENCES "User" ("id");

ALTER TABLE "WorkScheduleEmployee" ADD FOREIGN KEY ("work_schedule") REFERENCES "WorkSchedule" ("id");

ALTER TABLE "WorkScheduleEmployee" ADD FOREIGN KEY ("employee") REFERENCES "Employee" ("id");

ALTER TABLE "WorkScheduleTimeRange" ADD FOREIGN KEY ("work_schedule") REFERENCES "WorkSchedule" ("id");

ALTER TABLE "WorkScheduleTimeRange" ADD FOREIGN KEY ("time_range") REFERENCES "TimeRange" ("id");

ALTER TABLE "QRCode" ADD FOREIGN KEY ("qrcode_generator") REFERENCES "QRCodeGenerator" ("id");

ALTER TABLE "QRCode" ADD FOREIGN KEY ("attendance_validator") REFERENCES "AttendanceValidator" ("id");

ALTER TABLE "AttendanceValidatorAttendance" ADD FOREIGN KEY ("attendance_validator") REFERENCES "AttendanceValidator" ("id");

ALTER TABLE "AttendanceValidatorAttendance" ADD FOREIGN KEY ("attendence") REFERENCES "Attendance" ("id");
