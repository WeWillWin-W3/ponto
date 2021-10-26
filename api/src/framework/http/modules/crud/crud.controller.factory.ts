import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Request as RequestDecorator,
  Response as ResponseDecorator,
} from '@nestjs/common';
import {
  ArgumentMetadata,
  PipeTransform,
  Type as NestType,
} from '@nestjs/common/interfaces';
import { GenericRepository } from 'src/core/data-providers/generic.repository';
import { ClassType } from 'src/core/logic/ClassType';
import { Request, Response } from 'express';
import {
  User,
  UserRolePriority,
} from '../../middlewares/authenticate.middleware';
import { PartialRecord } from 'src/application/entities/util';
import { user_role, User as UserModel } from '.prisma/client';

type PrimaryKeyTransformerFn<T, K extends keyof T & string> = (
  primaryKey: K,
) => T[K];

type CrudControllerAction =
  | 'create'
  | 'getOne'
  | 'getAll'
  | 'deleteOne'
  | 'update';

type NestMethodDecorator = (path?: string | string[]) => MethodDecorator;

const controllerDecoratorByAction: Record<
  CrudControllerAction,
  NestMethodDecorator
> = {
  create: Post,
  getOne: Get,
  getAll: Get,
  deleteOne: Delete,
  update: Put,
};

type CrudControllerDependencies<T> = {
  genericRepository: GenericRepository<T>;
};

type CustomActions<T> = Partial<
  {
    [action in CrudControllerAction]: (
      dependencies: CrudControllerDependencies<T>,
    ) => (request: Request, response: Response) => Promise<any>;
  }
>;

type ActionsAuthorizationLevel = PartialRecord<CrudControllerAction, user_role>;

export type CrudControllerFactoryProps<T, C, U> = {
  route: string;
  primaryKey: keyof T & string;
  repositoryName: string;
  primaryKeyTransformer?: PrimaryKeyTransformerFn<T, keyof T & string>;
  CreateDto: ClassType<C>;
  UpdateDto: ClassType<U>;
  customActions?: CustomActions<T>;
  authorizationLevel?: ActionsAuthorizationLevel;
};

export function CrudControllerFactory<T, C, U>({
  route,
  primaryKey,
  primaryKeyTransformer,
  repositoryName,
  CreateDto,
  UpdateDto,
  customActions,
  authorizationLevel,
}: CrudControllerFactoryProps<T, C, U>): NestType<any> {
  const primaryKeyRoute = `/:${primaryKey}`;
  const primaryKeyParamPipes = primaryKeyTransformer
    ? [PrimaryKeyTransformerPipe(primaryKeyTransformer)]
    : [];

  let controllerDependencies: {
    genericRepository: GenericRepository<T>;
  } = {
    genericRepository: undefined,
  };

  const hasAuthorization = (action: CrudControllerAction, user: UserModel) =>
    authorizationLevel?.[action]
      ? UserRolePriority[user.user_role] >=
        UserRolePriority[authorizationLevel[action]]
      : true;

  @Controller(route)
  class CrudController {
    constructor(
      @Inject(repositoryName) private genericRepository: GenericRepository<T>,
    ) {
      controllerDependencies = { genericRepository };
    }

    @Post()
    @SetParamTypes(CreateDto)
    async create(@Body() createDto: C) {
      const result = await this.genericRepository.create(createDto);
      return result.value;
    }

    @Get(primaryKeyRoute)
    async getOne(
      @Param(primaryKey, ...primaryKeyParamPipes)
      pk: T[typeof primaryKey],
    ) {
      const query = { [primaryKey]: pk } as Partial<T>;
      const result = await this.genericRepository.getOne(query);
      return result.value;
    }

    @Get()
    async getAll(@User() user: UserModel) {
      console.log(hasAuthorization('getAll', user));
      const result = await this.genericRepository.getAll();
      return result.value;
    }

    @Delete(primaryKeyRoute)
    async deleteOne(
      @Param(primaryKey, ...primaryKeyParamPipes)
      pk: T[typeof primaryKey],
    ) {
      const query = { [primaryKey]: pk } as Partial<T>;
      const result = await this.genericRepository.deleteOne(query);
      return result.value;
    }

    @Put(primaryKeyRoute)
    @SetParamTypes(String, UpdateDto)
    async update(
      @Param(primaryKey, ...primaryKeyParamPipes)
      pk: T[typeof primaryKey],
      @Body() updateDto: U,
    ) {
      const query = { [primaryKey]: pk } as Partial<T>;
      const result = await this.genericRepository.updateOne(query, updateDto);
      return result.value;
    }
  }

  const dependencyFetcher = Object.defineProperties(
    {},
    Object.keys(controllerDependencies).reduce(
      (obj, dependencyName) => ({
        ...obj,
        [dependencyName]: {
          enumerable: true,
          get: () => controllerDependencies[dependencyName],
        },
      }),
      {},
    ),
  ) as CrudControllerDependencies<T>;

  Object.entries(customActions ?? {}).forEach(
    ([actionName, actionConstructor]) => {
      const action = actionConstructor(dependencyFetcher);

      CrudController.prototype[actionName] = action;

      RequestDecorator()(CrudController.prototype, actionName, 0);
      ResponseDecorator()(CrudController.prototype, actionName, 1);

      const controllerDecorator = controllerDecoratorByAction[actionName];
      controllerDecorator()(CrudController, actionName, { value: action });
    },
  );

  return CrudController;
}

const SetParamTypes = (...classTypes: any[]): MethodDecorator =>
  Reflect.metadata('design:paramtypes', classTypes);

const PrimaryKeyTransformerPipe = <T>(
  fn: PrimaryKeyTransformerFn<T, keyof T & string>,
): PipeTransform => ({
  transform(value: any, _metadata: ArgumentMetadata) {
    return fn(value);
  },
});

export const numberTransformer: PrimaryKeyTransformerFn<any, string> = (
  primaryKey: string,
) => Number(primaryKey);
