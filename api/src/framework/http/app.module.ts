import { Module } from '@nestjs/common';
import { PrismaService } from '../data-providers/prisma.service';
import { ExampleModule } from './entrypoint/employee/employee.module';

@Module({
  imports: [
    ExampleModule,
  ],
})
export class AppModule {}
