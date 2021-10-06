import { Module } from '@nestjs/common';
import { ExampleModule } from './entrypoint/example/example.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ExampleModule,
  ],
})
export class AppModule {}
