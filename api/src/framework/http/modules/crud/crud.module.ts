import { numberTransformer } from './crud.controller.factory';
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
    primaryKeyTransformer: numberTransformer,
    entityName: 'Employee',
    CreateDto: CreateEmployeeDto,
    UpdateDto: CreateEmployeeDto,
  }),
  CrudModuleController({
    route: '/attendances',
    primaryKey: 'id',
    primaryKeyTransformer: numberTransformer,
    entityName: 'Attendance',
    CreateDto: CreateAttendanceDto,
    UpdateDto: UpdateAttendanceDto,
  }),
]);
