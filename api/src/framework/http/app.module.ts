import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { User } from '@prisma/client';
import { AuthToken } from 'src/core/entities/authtoken.entity';
import { InMemoryGenericRepository } from '../data-providers/generic.inmemory.repository';
import { PrismaGenericRepositoryFactory } from '../data-providers/generic.prisma.repository';
import { PrismaService } from '../data-providers/prisma.service';
import { AuthenticateMiddleware } from './middlewares/authenticate.middleware';
import { AuthenticateModule } from './modules/authentication/authentication.module';
import { CrudModule } from './modules/crud/crud.module';

@Module({
  imports: [CrudModule, AuthenticateModule, ConfigModule.forRoot()],
  providers: [
    PrismaService,
    {
      provide: 'UserRepository',
      useClass: PrismaGenericRepositoryFactory<User>('User'),
    },
    {
      provide: 'TokenRepository',
      useValue: new InMemoryGenericRepository<AuthToken>('AuthToken'),
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticateMiddleware).exclude('/login(.*)').forRoutes('*');
  }
}
