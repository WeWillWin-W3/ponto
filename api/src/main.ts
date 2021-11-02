import { NestFactory } from '@nestjs/core';
import { AppModule } from './framework/http/app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  // app.useGlobalFilters(
  //   new DefaultExceptionFilter(),
  //   new NotFoundExceptionFilter(),
  // );
  await app.listen(3000);
}

bootstrap();
