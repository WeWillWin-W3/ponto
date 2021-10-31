import { UseCase } from '../../domain/usecase.entity';
import {
  GenericRepository,
  RepositoryError,
} from '../../data-providers/generic.repository';
import { Attendance, AttendanceCorrectionRequest } from '.prisma/client';
import { Either, isLeft, right } from '../../logic/Either';

type Dependencies = {
  attendanceRepository: GenericRepository<Attendance>;
  attendanceCorrectionRepository: GenericRepository<AttendanceCorrectionRequest>;
};

type Properties = {
  attendanceId?: Attendance['id'];
};

export type GetAttendanceUseCase = UseCase<
  Dependencies,
  Properties,
  Promise<Either<RepositoryError, Attendance | Attendance[]>>
>;

export const GetAttendanceUseCase: GetAttendanceUseCase =
  ({ attendanceRepository, attendanceCorrectionRepository }) =>
  async ({ attendanceId }) => {
    const getAttendanceWithCorrections = getAttendanceWithCorrectionsFactory({
      attendanceCorrectionRepository,
      attendanceRepository,
    });

    if (attendanceId !== undefined) {
      return getAttendanceWithCorrections({ attendanceId });
    }

    const attendancesOrError = await attendanceRepository.getAll();

    if (isLeft(attendancesOrError)) {
      return attendancesOrError;
    }

    const attendancesWithCorrectionsOrError = await Promise.all(
      attendancesOrError.value.map((attendance) =>
        getAttendanceWithCorrections({ attendanceId: attendance.id }),
      ),
    );

    const attendancesWithCorrectionsLeftIndex =
      attendancesWithCorrectionsOrError.findIndex((result) => isLeft(result));

    if (attendancesWithCorrectionsLeftIndex) {
      return attendancesWithCorrectionsOrError[
        attendancesWithCorrectionsLeftIndex
      ];
    }

    const attendancesWithCorrections = attendancesWithCorrectionsOrError.map(
      (attendance) => attendance.value,
    ) as Attendance[];

    return right(attendancesWithCorrections);
  };

const getAttendanceWithCorrectionsFactory =
  ({ attendanceRepository, attendanceCorrectionRepository }: Dependencies) =>
  async ({
    attendanceId,
    attendance,
  }: Properties & { attendance?: Attendance }) => {
    const attendanceCorrectionsOrError =
      await attendanceCorrectionRepository.getAll({
        attendance: attendanceId,
      });

    if (isLeft(attendanceCorrectionsOrError)) {
      return attendanceCorrectionsOrError;
    }

    // TODO: Add "createdAt" in AttendanceCorrectionRequest model
    // Compare id's to determine which one is latest
    const latestAcceptedAttendanceCorrection =
      attendanceCorrectionsOrError.value.reduce(
        (latestAccepted, current) =>
          latestAccepted === undefined ||
          (current.accepted && current.id > latestAccepted.id)
            ? current
            : latestAccepted,
        undefined,
      );

    if (!attendance) {
      const attendanceOrError = await attendanceRepository.getOne({
        id: attendanceId,
      });

      if (isLeft(attendanceOrError)) {
        return attendanceOrError;
      }

      attendance = attendanceOrError.value;
    }

    if (latestAcceptedAttendanceCorrection) {
      const { time: correctionTime, description: correctionDescription } =
        latestAcceptedAttendanceCorrection;
      const { time, description, ...attendanceData } = attendance;

      const attendanceWithCorrection: Attendance = {
        ...attendanceData,
        time: correctionTime,
        description: correctionDescription ?? description,
      };

      return right(attendanceWithCorrection);
    }

    return right(attendance);
  };
