import { CrudModuleController, CrudModuleFactory } from './crud.module.factory';
import {
  CreateAttendanceDto,
  UpdateAttendanceDto,
} from './dtos/attendance.dto';
import { CreateEmployeeDto } from './dtos/employee.dto';

export const CrudModule = CrudModuleFactory([
  CrudModuleController({
    route: '/employees',
    primaryKey: 'id',
    entityName: 'employee',
    CreateDto: CreateEmployeeDto,
    UpdateDto: CreateEmployeeDto,
  }),
  CrudModuleController({
    route: '/attendances',
    primaryKey: 'id',
    entityName: 'attendance',
    CreateDto: CreateAttendanceDto,
    UpdateDto: UpdateAttendanceDto,
  }),
]);
