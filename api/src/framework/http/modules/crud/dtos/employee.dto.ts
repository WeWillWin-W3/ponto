import { Employee } from '@prisma/client';
import { IsNumber, IsOptional } from 'class-validator';

export class CreateEmployeeDto implements Partial<Employee> {
  @IsNumber()
  user: number;

  @IsNumber()
  company: number;
}

export class UpdateEmployeeDto implements Partial<Employee> {
  @IsOptional()
  @IsNumber()
  user: number;
}
