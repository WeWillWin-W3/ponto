import { PrismaService } from './prisma.service';
import { Injectable } from '@nestjs/common';
import {
  GenericRepository,
  RepositoryError,
} from 'src/core/data-providers/generic.repository';
import { ClassType } from 'src/core/logic/ClassType';
import { Prisma } from '.prisma/client';
import { Either, fromPromise } from 'src/core/logic/Either';

export function PrismaGenericRepositoryFactory<T>(
  entityName: Prisma.ModelName,
): ClassType<GenericRepository<T>> {
  const [firstLetter, ...entityNameRest] = entityName;
  const prismaDelegateName = firstLetter
    .toLowerCase()
    .concat(...entityNameRest);
  @Injectable()
  class PrismaGenericRepository<T> implements GenericRepository<T> {
    constructor(private prisma: PrismaService) {}

    private get entityDelegate() {
      return this.prisma[prismaDelegateName];
    }

    async getAll(query?: Partial<T>): Promise<Either<RepositoryError, T[]>> {
      return fromPromise(
        this.entityDelegate.findMany(query ? { where: query } : {}),
      );
    }

    async getOne(query: Partial<T>): Promise<Either<RepositoryError, T>> {
      return fromPromise(this.entityDelegate.findFirst({ where: query }));
    }

    async updateOne(
      query: Partial<T>,
      data: Partial<T>,
    ): Promise<Either<RepositoryError, T>> {
      return fromPromise(this.entityDelegate.update({ where: query, data }));
    }

    async deleteOne(query: Partial<T>): Promise<Either<RepositoryError, T>> {
      return fromPromise(this.entityDelegate.delete({ where: query }));
    }

    async create(data: Partial<T>): Promise<Either<RepositoryError, T>> {
      return fromPromise(this.entityDelegate.create({ data }));
    }
  }

  return PrismaGenericRepository;
}
