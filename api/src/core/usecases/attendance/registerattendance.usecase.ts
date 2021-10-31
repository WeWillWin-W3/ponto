import { UseCase } from '../../domain/usecase.entity';
import { AuthToken } from '../../entities/authtoken.entity';
import {
  GenericRepository,
  RepositoryError,
} from '../../data-providers/generic.repository';
import { Attendance, Employee } from '.prisma/client';
import { User } from '../../entities/user.entity';
import { Either, isLeft } from '../../logic/Either';

export interface RegisterAttendance {
  description?: Attendance['description'];
}

type Dependencies = {
  attendanceRepository: GenericRepository<Attendance>;
  employeeRepository: GenericRepository<Employee>;
};

type Properties = {
  token: AuthToken;
  user: User;
  attendanceData: RegisterAttendance;
};

export type RegisterAttendanceUseCase = UseCase<
  Dependencies,
  Properties,
  Promise<Either<RepositoryError, Attendance>>
>;

export const RegisterAttendanceUseCase: RegisterAttendanceUseCase =
  ({ attendanceRepository, employeeRepository }) =>
  async ({ token, user, attendanceData }) => {
    const { company } = token;
    const { description } = attendanceData;

    const employeeOrError = await employeeRepository.getOne({
      company,
      user: user.id,
    });

    if (isLeft(employeeOrError)) {
      return employeeOrError;
    }

    const attendanceCreationData: Omit<Attendance, 'id'> = {
      time: new Date(),
      description,
      employee: employeeOrError.value.id,
    };

    const attendanceOrError = await attendanceRepository.create(
      attendanceCreationData,
    );

    return attendanceOrError;
  };
