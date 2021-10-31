import { UseCase } from '../../domain/usecase.entity';
import { AuthToken } from '../../entities/authtoken.entity';
import {
  GenericRepository,
  RepositoryError,
} from '../../data-providers/generic.repository';
import {
  Attendance,
  AttendanceCorrectionRequest,
  Employee,
} from '.prisma/client';
import { User } from '../../entities/user.entity';
import { Either, isLeft, right } from '../../logic/Either';

type Dependencies = {
  attendanceRepository: GenericRepository<Attendance>;
  attendanceCorrectionRepository: GenericRepository<AttendanceCorrectionRequest>;
  employeeRepository: GenericRepository<Employee>;
};

type Properties = {
  token: AuthToken;
  user: User;
  attendanceId: Attendance['id'];
};

export type GetAttendanceUseCase = UseCase<
  Dependencies,
  Properties,
  Promise<Either<RepositoryError, Attendance>>
>;

export const GetAttendanceUseCase: GetAttendanceUseCase =
  ({
    attendanceRepository,
    employeeRepository,
    attendanceCorrectionRepository,
  }) =>
  async ({ token, user, attendanceId }) => {
    const { company } = token;

    const employeeOrError = await employeeRepository.getOne({
      company,
      user: user.id,
    });

    if (isLeft(employeeOrError)) {
      return employeeOrError;
    }

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

    const attendanceOrError = await attendanceRepository.getOne({
      id: attendanceId,
    });

    if (isLeft(attendanceOrError)) {
      return attendanceOrError;
    }

    if (latestAcceptedAttendanceCorrection) {
      const { time: correctionTime, description: correctionDescription } =
        latestAcceptedAttendanceCorrection;
      const { time, description, ...attendanceData } = attendanceOrError.value;

      const attendance: Attendance = {
        ...attendanceData,
        time: correctionTime,
        description: correctionDescription ?? description,
      };

      return right(attendance);
    }

    return attendanceOrError;
  };
