import { User } from '@prisma/client';
import { Module } from '@nestjs/common';
import { MockGenericRepository } from 'src/framework/data-providers/generic.mock.repository';
import { PrismaGenericRepositoryFactory } from 'src/framework/data-providers/generic.prisma.repository';
import { LoginController } from './login.controller';
import { PrismaService } from 'src/framework/data-providers/prisma.service';
import { AuthToken } from 'src/core/entities/AuthToken';

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
      provide: 'TokenRepository',
      useValue: new MockGenericRepository<AuthToken>('token'),
    },
  ],
})
export class AuthenticateModule {}
