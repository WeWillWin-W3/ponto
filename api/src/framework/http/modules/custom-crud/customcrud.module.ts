import {
  Attendance,
  AttendanceCorrectionRequest,
  Employee,
  User,
} from '@prisma/client';
import { Module } from '@nestjs/common';
import { PrismaGenericRepositoryFactory } from 'src/framework/data-providers/generic.prisma.repository';
import { AttendanceController } from './attendance.controller';
import { PrismaService } from 'src/framework/data-providers/prisma.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [AttendanceController],
  providers: [
    PrismaService,
    {
      provide: 'AttendanceRepository',
      useClass: PrismaGenericRepositoryFactory<Attendance>('Attendance'),
    },
    {
      provide: 'AttendanceCorrectionRepository',
      useClass: PrismaGenericRepositoryFactory<AttendanceCorrectionRequest>(
        'AttendanceCorrectionRequest',
      ),
    },
    {
      provide: 'EmployeeRepository',
      useClass: PrismaGenericRepositoryFactory<Employee>('Employee'),
    },
  ],
})
export class CustomCrudModule {}
