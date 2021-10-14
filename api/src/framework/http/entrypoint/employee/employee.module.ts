import { Employee } from '.prisma/client';
import { Module } from '@nestjs/common';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { PrismaGenericRepository } from 'src/framework/data-providers/generic.prisma.repository';
import { PrismaService } from 'src/framework/data-providers/prisma.service';
import { generateCrudController } from '../../adapters/generateCrudController';

class CreateEmployeeDto implements Partial<Employee> {
    @IsString()
    name: string

    @IsNumber()
    user: number

    @IsNumber()
    company: number
}

class UpdateEmployeeDto implements Partial<Employee> { 
  @IsString()
  name: string
}

const EmployeeController = generateCrudController<
    Employee, CreateEmployeeDto, UpdateEmployeeDto
>({
    route: '/employee', 
    primaryKey: 'id', 
    repositoryName: 'employeeRepository',
    CreateDto: CreateEmployeeDto, 
    UpdateDto: UpdateEmployeeDto
})

@Module({
  imports: [],
  controllers: [EmployeeController],
  providers: [
    PrismaService,
    { provide: 'entityName', useValue: 'employee' },
    { provide: 'employeeRepository', useClass: PrismaGenericRepository }
  ]
})
export class EmployeeModule {}