import { Module } from '@nestjs/common';
import { CrudModule } from './modules/crud/crud.module';

@Module({
  imports: [
    CrudModule,
  ]
})
export class AppModule {}
