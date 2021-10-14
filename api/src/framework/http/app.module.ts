import { Module } from '@nestjs/common';
import { EmployeeModule } from './entrypoint/employee/employee.module';

@Module({
  imports: [
    EmployeeModule,
  ],
})
export class AppModule {}
