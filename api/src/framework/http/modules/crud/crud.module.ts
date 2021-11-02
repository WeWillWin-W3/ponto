import { User } from 'src/core/entities/user.entity';
import { GenericRepository } from 'src/core/data-providers/generic.repository';
import { mapLeft, mapRight } from 'src/core/logic/Either';
import { numberTransformer } from './crud.controller.factory';
import { CrudModuleController, CrudModuleFactory } from './crud.module.factory';
import {
  CreateAttendanceDto,
  UpdateAttendanceDto,
} from './dtos/attendance.dto';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dtos/employee.dto';
import { CreateUserDto, UpdateUserDto } from './dtos/user.dto';
import { UseCaseInstance } from 'src/core/domain/usecase.entity';
import { CreateUserUseCase } from 'src/core/usecases/user/createuser.usecase';

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
    CreateDto: CreateUserDto,
    UpdateDto: UpdateUserDto,
    customActions: {
      getAll: (deps) => async (req, res) => {
        const { genericRepository } = deps;
        const userRepository = genericRepository as GenericRepository<User>;
        const usersOrError = await userRepository.getAll();

        const usersOrErrorResponse = mapLeft(
          usersOrError,
          ({ message, name: error }) => ({ message, error }),
        );

        const usersWithoutPasswordOrErrorResponse = mapRight(
          usersOrErrorResponse,
          (users) => users.map(({ password, ...userData }) => userData),
        );

        return res.json(usersWithoutPasswordOrErrorResponse.value);
      },
      getOne: (deps) => async (req, res) => {
        const { genericRepository } = deps;
        const userRepository = genericRepository as GenericRepository<User>;
        const { id } = req.params;
        const userOrError = await userRepository.getOne({ id: Number(id) });

        const userOrErrorResponse = mapLeft(
          userOrError,
          ({ message, name: error }) => ({ message, error }),
        );

        const userWithoutPasswordOrErrorResponse = mapRight(
          userOrErrorResponse,
          ({ password, ...userData }) => userData,
        );

        return res.json(userWithoutPasswordOrErrorResponse.value);
      },
      update: (deps) => async (req, res) => {
        const { genericRepository } = deps;
        const userRepository = genericRepository as GenericRepository<User>;
        const { id } = req.params;
        const { name } = req.body;

        const userOrError = await userRepository.updateOne(
          { id: Number(id) },
          { name },
        );

        const userOrErrorResponse = mapLeft(
          userOrError,
          ({ message, name: error }) => ({ message, error }),
        );

        const userWithoutPasswordOrErrorResponse = mapRight(
          userOrErrorResponse,
          ({ password, ...userData }) => userData,
        );

        return res.json(userWithoutPasswordOrErrorResponse.value);
      },
      deleteOne: (deps) => async (req, res) => {
        const { genericRepository } = deps;
        const userRepository = genericRepository as GenericRepository<User>;
        const { id } = req.params;
        const userOrError = await userRepository.deleteOne({ id: Number(id) });

        const userOrErrorResponse = mapLeft(
          userOrError,
          ({ message, name: error }) => ({ message, error }),
        );

        const userWithoutPasswordOrErrorResponse = mapRight(
          userOrErrorResponse,
          ({ password, ...userData }) => userData,
        );

        return res.json(userWithoutPasswordOrErrorResponse.value);
      },
      create: (deps) => {
        const { genericRepository } = deps;
        const userRepository = genericRepository as GenericRepository<User>;
        const createUserUseCase: UseCaseInstance<CreateUserUseCase> =
          CreateUserUseCase({
            userRepository,
          });

        return async (req, res) => {
          const { name, email, password } = req.body;
          const createdUserOrError = await createUserUseCase({
            userData: {
              name,
              email,
              password,
            },
          });

          const createdUserOrErrorResponse = mapLeft(
            createdUserOrError,
            ({ message, name: error }) => ({ message, error }),
          );

          return res.json(createdUserOrErrorResponse.value);
        };
      },
    },
    authorizationLevel: {
      getAll: 'admin',
    },
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
