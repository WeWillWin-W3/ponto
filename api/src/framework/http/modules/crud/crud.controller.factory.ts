import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ArgumentMetadata,
  PipeTransform,
  Type as NestType,
} from '@nestjs/common/interfaces';
import { GenericRepository } from 'src/core/data-providers/generic.repository';
import { ClassType } from 'src/core/logic/ClassType';

type PrimaryKeyTransformerFn<T, K extends keyof T & string> = (
  primaryKey: K,
) => T[K];

export type CrudControllerFactoryProps<T, C, U> = {
  route: string;
  primaryKey: keyof T & string;
  repositoryName: string;
  primaryKeyTransformer?: PrimaryKeyTransformerFn<T, keyof T & string>;
  CreateDto: ClassType<C>;
  UpdateDto: ClassType<U>;
};

export function CrudControllerFactory<T, C, U>({
  route,
  primaryKey,
  primaryKeyTransformer,
  repositoryName,
  CreateDto,
  UpdateDto,
}: CrudControllerFactoryProps<T, C, U>): NestType<any> {
  const primaryKeyRoute = `/:${primaryKey}`;
  const primaryKeyParamPipes = primaryKeyTransformer
    ? [PrimaryKeyTransformerPipe(primaryKeyTransformer)]
    : [];

  @Controller(route)
  class CrudController {
    constructor(
      @Inject(repositoryName) private genericRepository: GenericRepository<T>,
    ) {}

    @Post()
    @Reflect.metadata('design:paramtypes', [CreateDto])
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
    @Reflect.metadata('design:paramtypes', [String, UpdateDto])
    update(
      @Param(primaryKey, ...primaryKeyParamPipes)
      pk: T[typeof primaryKey],
      @Body() updateDto: U,
    ) {
      const query = { [primaryKey]: pk } as Partial<T>;
      return this.genericRepository.updateOne(query, updateDto);
    }
  }

  return CrudController;
}

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
