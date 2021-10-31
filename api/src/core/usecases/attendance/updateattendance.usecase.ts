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
};

type Properties = {
  attendanceData: UpdateAttendance;
};

export type UpdateAttendanceUseCase = UseCase<
  Dependencies,
  Properties,
  Promise<Either<RepositoryError, AttendanceCorrectionRequest>>
>;

export const UpdateAttendanceUseCase: UpdateAttendanceUseCase =
  ({ attendanceRepository, attendanceCorrectionRepository }) =>
  async ({ attendanceData }) => {
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
