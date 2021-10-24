import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { User } from '@prisma/client';
import { MockGenericRepository } from '../data-providers/generic.mock.repository';
import { PrismaGenericRepositoryFactory } from '../data-providers/generic.prisma.repository';
import { PrismaService } from '../data-providers/prisma.service';
import {
  AuthenticateMiddleware,
  Token,
} from './middlewares/authenticate.middleware';
import { AuthenticateModule } from './modules/authentication/authentication.module';
import { CrudModule } from './modules/crud/crud.module';

@Module({
  imports: [CrudModule, AuthenticateModule],
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
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticateMiddleware).forRoutes('*');
  }
}
