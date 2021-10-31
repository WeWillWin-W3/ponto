import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import {
  Attendance,
  AttendanceCorrectionRequest,
  Employee,
} from '@prisma/client';
import { IsDate, IsOptional, IsString } from 'class-validator';
import { GenericRepository } from 'src/core/data-providers/generic.repository';
import { mapLeft } from 'src/core/logic/Either';
import { UseCaseInstance } from 'src/core/domain/usecase.entity';
import { RegisterAttendanceUseCase } from 'src/core/usecases/attendance/registerattendance.usecase';
import {
  RemoveAttendance,
  RemoveAttendanceUseCase,
} from 'src/core/usecases/attendance/removeattendance.usecase';
import {
  UpdateAttendance,
  UpdateAttendanceUseCase,
} from 'src/core/usecases/attendance/updateattendance.usecase';
import { GetAttendanceUseCase } from 'src/core/usecases/attendance/getattendance.usecase';
import { RegisterAttendance } from 'src/core/usecases/attendance/registerattendance.usecase';

class RegisterAttendanceDTO implements RegisterAttendance {
  @IsString()
  description: RemoveAttendance['description'];
}

class RemoveAttendanceDTO implements RemoveAttendance {
  @IsString()
  description: RemoveAttendance['description'];
}

class UpdateAttendanceDTO implements UpdateAttendance {
  @IsDate()
  @IsOptional()
  time?: UpdateAttendance['time'] | null;

  @IsString()
  description?: UpdateAttendance['description'];
}

@Controller('/attendance')
export class AttendanceController {
  registerAttendanceUseCase: UseCaseInstance<RegisterAttendanceUseCase>;
  removeAttendanceUseCase: UseCaseInstance<RemoveAttendanceUseCase>;
  updateAttendanceUseCase: UseCaseInstance<UpdateAttendanceUseCase>;
  getAttendanceUseCase: UseCaseInstance<GetAttendanceUseCase>;

  constructor(
    @Inject('EmployeeRepository')
    private employeeRepository: GenericRepository<Employee>,
    @Inject('AttendanceRepository')
    private attendanceRepository: GenericRepository<Attendance>,
    @Inject('AttendanceCorrectionRepository')
    private attendanceCorrectionRepository: GenericRepository<AttendanceCorrectionRequest>,
  ) {
    this.registerAttendanceUseCase = RegisterAttendanceUseCase({
      attendanceRepository: this.attendanceRepository,
      employeeRepository: this.employeeRepository,
    });

    this.removeAttendanceUseCase = RemoveAttendanceUseCase({
      attendanceRepository: this.attendanceRepository,
      attendanceCorrectionRepository: this.attendanceCorrectionRepository,
    });

    this.updateAttendanceUseCase = UpdateAttendanceUseCase({
      attendanceRepository: this.attendanceRepository,
      attendanceCorrectionRepository: this.attendanceCorrectionRepository,
    });

    this.getAttendanceUseCase = GetAttendanceUseCase({
      attendanceRepository: this.attendanceRepository,
      attendanceCorrectionRepository: this.attendanceCorrectionRepository,
    });
  }

  @Post()
  async create(
    @Body() registerAttendanceDTO: RegisterAttendanceDTO,
    @Req() req,
  ) {
    const { user, token } = req;

    const registerResultOrError = await this.registerAttendanceUseCase({
      user,
      token,
      attendanceData: registerAttendanceDTO,
    });

    const registerResultOrErrorResponse = mapLeft(
      registerResultOrError,
      ({ name: error, message }) => ({ error, message }),
    );

    return registerResultOrErrorResponse.value;
  }

  @Get('/:id')
  async getOne(
    @Param('id')
    attendanceId: Attendance['id'],
  ) {
    const getResultOrError = await this.getAttendanceUseCase({
      attendanceId,
    });

    const getResultOrErrorResponse = mapLeft(
      getResultOrError,
      ({ name: error, message }) => ({ error, message }),
    );

    return getResultOrErrorResponse.value;
  }

  @Get()
  async getAll() {
    const getResultOrError = await this.getAttendanceUseCase({});

    const getResultOrErrorResponse = mapLeft(
      getResultOrError,
      ({ name: error, message }) => ({ error, message }),
    );

    return getResultOrErrorResponse.value;
  }

  @Delete('/:id')
  async deleteOne(
    @Param('id')
    attendanceId: Attendance['id'],
    @Body()
    removeAttendanceDto: RemoveAttendanceDTO,
  ) {
    const removeResultOrError = await this.removeAttendanceUseCase({
      attendanceData: removeAttendanceDto,
      attendanceId,
    });

    const removeResultOrErrorResponse = mapLeft(
      removeResultOrError,
      ({ name: error, message }) => ({ error, message }),
    );

    return removeResultOrErrorResponse.value;
  }

  @Put('/:id')
  async update(
    @Param('id')
    attendanceId: Attendance['id'],
    @Body()
    updateAttendanceDTO: UpdateAttendanceDTO,
  ) {
    const updateResultOrError = await this.updateAttendanceUseCase({
      attendanceData: updateAttendanceDTO,
      attendanceId: attendanceId,
    });

    const updateResultOrErrorResponse = mapLeft(
      updateResultOrError,
      ({ name: error, message }) => ({ error, message }),
    );

    return updateResultOrErrorResponse.value;
  }
}
