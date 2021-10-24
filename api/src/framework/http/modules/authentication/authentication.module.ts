import { User } from '@prisma/client';
import { Module } from '@nestjs/common';
import { MockGenericRepository } from 'src/framework/data-providers/generic.mock.repository';
import { PrismaGenericRepositoryFactory } from 'src/framework/data-providers/generic.prisma.repository';
import { Token } from '../../middlewares/authenticate.middleware';
import { LoginController } from './login.controller';
import { PrismaService } from 'src/framework/data-providers/prisma.service';

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
      useValue: new MockGenericRepository<Token>('token'),
    },
  ],
})
export class AuthenticateModule {}
