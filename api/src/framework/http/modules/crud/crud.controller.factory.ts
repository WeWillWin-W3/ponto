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
  UseGuards,
} from '@nestjs/common';
import {
  ArgumentMetadata,
  CanActivate,
  ExecutionContext,
  PipeTransform,
  Type as NestType,
} from '@nestjs/common/interfaces';
import { GenericRepository } from 'src/core/data-providers/generic.repository';
import { ClassType } from 'src/core/logic/ClassType';
import { Request, Response } from 'express';
import { UserRolePriority } from '../../middlewares/authenticate.middleware';
import { PartialRecord } from 'src/application/entities/util';
import { user_role, User as UserModel } from '.prisma/client';
import { Observable } from 'rxjs';

type PrimaryKeyTransformerFn<T, K extends keyof T & string> = (
  primaryKey: K,
) => T[K];

type CrudControllerAction =
  | 'create'
  | 'getOne'
  | 'getAll'
  | 'deleteOne'
  | 'update';

const controllerDecoratorByAction = (
  primaryKeyRoute: string,
): Record<CrudControllerAction, MethodDecorator> => ({
  create: Post(),
  getOne: Get(primaryKeyRoute),
  getAll: Get(),
  deleteOne: Delete(primaryKeyRoute),
  update: Put(primaryKeyRoute),
});

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

const UserRoleGuard = (
  authorizationLevel: ActionsAuthorizationLevel,
): CanActivate => ({
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as UserModel;
    const controllerActionName = context.getHandler()
      .name as CrudControllerAction;
    const actionAuthorization = authorizationLevel[controllerActionName];

    return actionAuthorization
      ? UserRolePriority[user.user_role] >=
          UserRolePriority[actionAuthorization]
      : true;
  },
});

export function CrudControllerFactory<T, C, U>({
  route,
  primaryKey,
  primaryKeyTransformer,
  repositoryName,
  CreateDto,
  UpdateDto,
  customActions,
  authorizationLevel = {},
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

  const userRoleGuard = UserRoleGuard(authorizationLevel);

  @Controller(route)
  class CrudController {
    constructor(
      @Inject(repositoryName) private genericRepository: GenericRepository<T>,
    ) {
      controllerDependencies = { genericRepository };
    }

    @Post()
    @UseGuards(userRoleGuard)
    @SetParamTypes(CreateDto)
    async create(@Body() createDto: C) {
      const result = await this.genericRepository.create(createDto);
      return result.value;
    }

    @Get()
    @UseGuards(userRoleGuard)
    async getAll() {
      const result = await this.genericRepository.getAll();
      return result.value;
    }

    @Get(primaryKeyRoute)
    @UseGuards(userRoleGuard)
    async getOne(
      @Param(primaryKey, ...primaryKeyParamPipes)
      pk: T[typeof primaryKey],
    ) {
      const query = { [primaryKey]: pk } as Partial<T>;
      const result = await this.genericRepository.getOne(query);
      return result.value;
    }

    @Delete(primaryKeyRoute)
    @UseGuards(userRoleGuard)
    async deleteOne(
      @Param(primaryKey, ...primaryKeyParamPipes)
      pk: T[typeof primaryKey],
    ) {
      const query = { [primaryKey]: pk } as Partial<T>;
      const result = await this.genericRepository.deleteOne(query);
      return result.value;
    }

    @Put(primaryKeyRoute)
    @UseGuards(userRoleGuard)
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

      Reflect.defineMetadata(
        '__routeArguments__',
        {},
        CrudController.prototype.constructor,
        actionName,
      );

      RequestDecorator()(CrudController.prototype, actionName, 0);
      ResponseDecorator()(CrudController.prototype, actionName, 1);

      const controllerDecorator =
        controllerDecoratorByAction(primaryKeyRoute)[actionName];
      controllerDecorator(CrudController, actionName, { value: action });
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
