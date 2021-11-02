import { UseCase } from '../../domain/usecase.entity';
import {
  GenericRepository,
  RepositoryError,
} from '../../data-providers/generic.repository';
import { Attendance, AttendanceCorrectionRequest } from '.prisma/client';
import { Either, isLeft } from '../../logic/Either';

export interface UpdateAttendance {
  time?: Attendance['time'] | null;
  description?: Attendance['description'];
}

type Dependencies = {
  attendanceRepository: GenericRepository<Attendance>;
  attendanceCorrectionRepository: GenericRepository<AttendanceCorrectionRequest>;
};

type Properties = {
  attendanceData: UpdateAttendance;
  attendanceId: Attendance['id'];
};

export type UpdateAttendanceUseCase = UseCase<
  Dependencies,
  Properties,
  Promise<Either<RepositoryError, AttendanceCorrectionRequest>>
>;

export const UpdateAttendanceUseCase: UpdateAttendanceUseCase =
  ({ attendanceRepository, attendanceCorrectionRepository }) =>
  async ({ attendanceData, attendanceId }) => {
    const { time, description } = attendanceData;

    const attendanceOrError = await attendanceRepository.getOne({
      id: attendanceId,
    });

    if (isLeft(attendanceOrError)) {
      return attendanceOrError;
    }

    const attendanceCorrectionData: Omit<
      AttendanceCorrectionRequest,
      'id' | 'attester' | 'accepted' | 'created_at'
    > = {
      time,
      description,
      attendance: attendanceOrError.value.id,
    };

    const attendanceCorrectionOrError =
      await attendanceCorrectionRepository.create(attendanceCorrectionData);

    return attendanceCorrectionOrError;
  };
