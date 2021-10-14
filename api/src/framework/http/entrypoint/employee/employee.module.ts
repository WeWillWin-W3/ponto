import { Employee } from '.prisma/client';
import { Module } from '@nestjs/common';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { PrismaGenericRepository } from 'src/framework/data-providers/generic.prisma.repository';
import { PrismaService } from 'src/framework/data-providers/prisma.service';
import { generateCrudController } from '../../adapters/generateCrudController';

class CreateUserDto {
  @IsEmail()
  email: string
}

class UpdateUserDto { 
  @IsNotEmpty()
  id: string

  @IsEmail()
  email: string
}

const EmployeeController = generateCrudController<
    Employee, CreateUserDto, UpdateUserDto
>({
    route: '/employee', 
    primaryKey: 'id', 
    repositoryName: 'employeeRepository',
    CreateDto: CreateUserDto, 
    UpdateDto: UpdateUserDto
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
export class ExampleModule {}