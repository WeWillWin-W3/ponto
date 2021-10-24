import { numberTransformer } from './crud.controller.factory';
import { CrudModuleController, CrudModuleFactory } from './crud.module.factory';
import {
  CreateAttendanceDto,
  UpdateAttendanceDto,
} from './dtos/attendance.dto';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dtos/employee.dto';

export const CrudModule = CrudModuleFactory([
  CrudModuleController({
    route: '/employees',
    primaryKey: 'id',
    primaryKeyTransformer: numberTransformer,
    entityName: 'Employee',
    CreateDto: CreateEmployeeDto,
    UpdateDto: UpdateEmployeeDto,
  }),
  CrudModuleController({
    route: '/users',
    primaryKey: 'id',
    primaryKeyTransformer: numberTransformer,
    entityName: 'User',
    CreateDto: CreateEmployeeDto,
    UpdateDto: UpdateEmployeeDto,
    customActions: {
      create: (deps) => async (req, res) => {
        return res.json({ message: 'Aqui vai um useCase customizado' });
      },
    },
    authorizationLevel: {
      getAll: 'admin',
    },
  }),
  CrudModuleController({
    route: '/attendances',
    primaryKey: 'id',
    primaryKeyTransformer: numberTransformer,
    entityName: 'Attendance',
    CreateDto: CreateAttendanceDto,
    UpdateDto: UpdateAttendanceDto,
  }),
  CrudModuleController({
    route: '/companies',
    primaryKey: 'id',
    primaryKeyTransformer: numberTransformer,
    entityName: 'Company',
    CreateDto: CreateAttendanceDto,
    UpdateDto: UpdateAttendanceDto,
  }),
  CrudModuleController({
    route: '/overtimework/approve',
    primaryKey: 'id',
    primaryKeyTransformer: numberTransformer,
    entityName: 'OvertimeWorkApproval',
    CreateDto: CreateAttendanceDto,
    UpdateDto: UpdateAttendanceDto,
  }),
  CrudModuleController({
    route: '/workschedule',
    primaryKey: 'id',
    primaryKeyTransformer: numberTransformer,
    entityName: 'WorkSchedule',
    CreateDto: CreateAttendanceDto,
    UpdateDto: UpdateAttendanceDto,
  }),
]);
