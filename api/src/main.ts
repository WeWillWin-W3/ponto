import { NestFactory } from '@nestjs/core';
import { AppModule } from './framework/http/app.module';
import { ValidationPipe } from '@nestjs/common';
import { DefaultExceptionFilter } from './framework/config/exceptions/default.exception.filter';
import { NotFoundExceptionFilter } from './framework/config/exceptions/not-found-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  // app.useGlobalFilters(
  //   new DefaultExceptionFilter(),
  //   new NotFoundExceptionFilter(),
  // );
  await app.listen(3000);
}

bootstrap();
