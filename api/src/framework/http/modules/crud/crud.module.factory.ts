import { Prisma } from '.prisma/client';
import { Type, Module } from '@nestjs/common';
import { GenericRepository } from 'src/core/data-providers/generic.repository';
import { PrismaGenericRepositoryFactory } from 'src/framework/data-providers/generic.prisma.repository';
import { PrismaService } from 'src/framework/data-providers/prisma.service';
import {
  CrudControllerFactoryProps,
  CrudControllerFactory,
} from './crud.controller.factory';

type NestProvidedRepository = {
  provide: string;
  useClass: Type<GenericRepository<any>>;
};

type CrudModuleControllerWithDeps = {
  repository: NestProvidedRepository;
  controller: Type<any>;
};

export type CrudModuleFactoryProps<T, C, U> = Omit<
  CrudControllerFactoryProps<T, C, U>,
  'repositoryName'
> & {
  entityName: Prisma.ModelName;
};

export const CrudModuleController = <T, C, U>({
  route,
  primaryKey,
  primaryKeyTransformer,
  entityName,
  CreateDto,
  UpdateDto,
  customActions,
  authorizationLevel,
}: CrudModuleFactoryProps<T, C, U>): CrudModuleControllerWithDeps => ({
  controller: CrudControllerFactory<T, C, U>({
    route,
    primaryKey,
    primaryKeyTransformer,
    repositoryName: `${entityName}Repository`,
    CreateDto,
    UpdateDto,
    customActions,
    authorizationLevel,
  }),
  repository: {
    provide: `${entityName}Repository`,
    useClass: PrismaGenericRepositoryFactory(entityName),
  },
});

export function CrudModuleFactory(
  props: CrudModuleControllerWithDeps[],
): Type<any> {
  const { repositories, controllers } = props.reduce(
    (accumulator, { controller, repository }) => ({
      repositories: [...accumulator.repositories, repository],
      controllers: [...accumulator.controllers, controller],
    }),
    { repositories: [], controllers: [] },
  );

  @Module({
    imports: [],
    controllers,
    providers: [PrismaService, ...repositories],
  })
  class CrudModule {}

  return CrudModule;
}
