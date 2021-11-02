import { Attendance } from '@prisma/client';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreateAttendanceDto implements Partial<Attendance> {
  @IsDate()
  time: Date;

  @IsNotEmpty()
  employee: number;
}

export class UpdateAttendanceDto implements Partial<Attendance> {
  @IsString()
  description: string;
}
