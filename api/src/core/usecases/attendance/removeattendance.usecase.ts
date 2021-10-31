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

type Dependencies = {
  attendanceRepository: GenericRepository<Attendance>;
  attendanceCorrectionRepository: GenericRepository<AttendanceCorrectionRequest>;
  employeeRepository: GenericRepository<Employee>;
};

type Properties = {
  token: AuthToken;
  user: User;
  description?: string;
  attendanceId: Attendance['id'];
};

export type RegisterAttendanceUseCase = UseCase<
  Dependencies,
  Properties,
  Promise<Either<RepositoryError, AttendanceCorrectionRequest>>
>;

export const RegisterAttendanceUseCase: RegisterAttendanceUseCase =
  ({
    attendanceRepository,
    employeeRepository,
    attendanceCorrectionRepository,
  }) =>
  async ({ token, user, description, attendanceId }) => {
    const { company } = token;

    const employeeOrError = await employeeRepository.getOne({
      company,
      user: user.id,
    });

    if (isLeft(employeeOrError)) {
      return employeeOrError;
    }

    const attendanceOrError = await attendanceRepository.getOne({
      id: attendanceId,
    });

    if (isLeft(attendanceOrError)) {
      return attendanceOrError;
    }

    const attendanceCorrectionData: Omit<
      AttendanceCorrectionRequest,
      'id' | 'attester' | 'accepted'
    > = {
      time: null,
      description,
      attendance: attendanceOrError.value.id,
    };

    const attendanceCorrectionOrError =
      await attendanceCorrectionRepository.create(attendanceCorrectionData);

    return attendanceCorrectionOrError;
  };
