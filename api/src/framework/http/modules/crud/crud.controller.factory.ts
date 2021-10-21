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

type CustomActions<T> = Partial<
  {
    [action in CrudControllerAction]: (
      dependenciesFetcher: () => {
        genericRepository: GenericRepository<T>;
      },
    ) => (request: Request, response: Response) => Promise<any>;
  }
>;

export type CrudControllerFactoryProps<T, C, U> = {
  route: string;
  primaryKey: keyof T & string;
  repositoryName: string;
  primaryKeyTransformer?: PrimaryKeyTransformerFn<T, keyof T & string>;
  CreateDto: ClassType<C>;
  UpdateDto: ClassType<U>;
  customActions?: CustomActions<T>;
};

export function CrudControllerFactory<T, C, U>({
  route,
  primaryKey,
  primaryKeyTransformer,
  repositoryName,
  CreateDto,
  UpdateDto,
  customActions,
}: CrudControllerFactoryProps<T, C, U>): NestType<any> {
  const primaryKeyRoute = `/:${primaryKey}`;
  const primaryKeyParamPipes = primaryKeyTransformer
    ? [PrimaryKeyTransformerPipe(primaryKeyTransformer)]
    : [];

  let controllerDependencies: {
    genericRepository: GenericRepository<T>;
  };
  @Controller(route)
  class CrudController {
    constructor(
      @Inject(repositoryName) public genericRepository: GenericRepository<T>,
    ) {
      controllerDependencies = { genericRepository };
    }

    @Post()
    @SetParamTypes(CreateDto)
    create(@Body() createDto: C) {
      return this.genericRepository.create(createDto);
    }

    @Get(primaryKeyRoute)
    async getOne(
      @Param(primaryKey, ...primaryKeyParamPipes)
      pk: T[typeof primaryKey],
    ) {
      const query = { [primaryKey]: pk } as Partial<T>;
      return this.genericRepository.getOne(query);
    }

    @Get()
    getAll() {
      return this.genericRepository.getAll();
    }

    @Delete(primaryKeyRoute)
    deleteOne(
      @Param(primaryKey, ...primaryKeyParamPipes)
      pk: T[typeof primaryKey],
    ) {
      const query = { [primaryKey]: pk } as Partial<T>;
      return this.genericRepository.deleteOne(query);
    }

    @Put(primaryKeyRoute)
    @SetParamTypes(String, UpdateDto)
    update(
      @Param(primaryKey, ...primaryKeyParamPipes)
      pk: T[typeof primaryKey],
      @Body() updateDto: U,
    ) {
      const query = { [primaryKey]: pk } as Partial<T>;
      return this.genericRepository.updateOne(query, updateDto);
    }
  }

  Object.entries(customActions || {}).forEach(
    ([actionName, actionConstructor]) => {
      const dependenciesFetcher = () => controllerDependencies;
      const action = actionConstructor(dependenciesFetcher);

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
