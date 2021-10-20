import { Employee } from '@prisma/client';
import { IsString, IsNumber } from 'class-validator';

export class CreateEmployeeDto implements Partial<Employee> {
  @IsString()
  name: string;

  @IsNumber()
  user: number;

  @IsNumber()
  company: number;
}

export class UpdateEmployeeDto implements Partial<Employee> {
  @IsString()
  name: string;
}
