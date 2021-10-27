import { Employee, User } from '@prisma/client';
import { Module } from '@nestjs/common';
import { InMemoryGenericRepository } from 'src/framework/data-providers/generic.inmemory.repository';
import { PrismaGenericRepositoryFactory } from 'src/framework/data-providers/generic.prisma.repository';
import { LoginController } from './login.controller';
import { PrismaService } from 'src/framework/data-providers/prisma.service';
import { AuthToken } from 'src/core/entities/authtoken.entity';

@Module({
  imports: [],
  controllers: [LoginController],
  providers: [
    PrismaService,
    {
      provide: 'UserRepository',
      useClass: PrismaGenericRepositoryFactory<User>('User'),
    },
    {
      provide: 'EmployeeRepository',
      useClass: PrismaGenericRepositoryFactory<Employee>('Employee'),
    },
    {
      provide: 'TokenRepository',
      useValue: new InMemoryGenericRepository<AuthToken>('AuthToken'),
    },
  ],
})
export class AuthenticateModule {}
