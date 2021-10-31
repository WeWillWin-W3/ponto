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
import { Either, isLeft } from '../../logic/Either';

export interface UpdateAttendance
  extends Pick<Attendance, 'time' | 'description' | 'id'> {}

type Dependencies = {
  attendanceRepository: GenericRepository<Attendance>;
  attendanceCorrectionRepository: GenericRepository<AttendanceCorrectionRequest>;
  employeeRepository: GenericRepository<Employee>;
};

type Properties = {
  token: AuthToken;
  user: User;
  attendanceData: UpdateAttendance;
};

export type UpdateAttendanceUseCase = UseCase<
  Dependencies,
  Properties,
  Promise<Either<RepositoryError, AttendanceCorrectionRequest>>
>;

export const UpdateAttendanceUseCase: UpdateAttendanceUseCase =
  ({
    attendanceRepository,
    employeeRepository,
    attendanceCorrectionRepository,
  }) =>
  async ({ token, user, attendanceData }) => {
    const { company } = token;

    const employeeOrError = await employeeRepository.getOne({
      company,
      user: user.id,
    });

    if (isLeft(employeeOrError)) {
      return employeeOrError;
    }

    const { id, time, description } = attendanceData;

    const attendanceOrError = await attendanceRepository.getOne({
      id,
    });

    if (isLeft(attendanceOrError)) {
      return attendanceOrError;
    }

    const attendanceCorrectionData: Omit<
      AttendanceCorrectionRequest,
      'id' | 'attester' | 'accepted'
    > = {
      time,
      description,
      attendance: attendanceOrError.value.id,
    };

    const attendanceCorrectionOrError =
      await attendanceCorrectionRepository.create(attendanceCorrectionData);

    return attendanceCorrectionOrError;
  };
