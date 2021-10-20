import { PrismaService } from './prisma.service';
import { Injectable } from '@nestjs/common';
import { GenericRepository } from 'src/core/data-providers/generic.repository';
import { ClassType } from 'src/core/logic/ClassType';
import { Prisma } from '.prisma/client';

export function PrismaGenericRepositoryFactory<T>(
  entityName: Prisma.ModelName,
): ClassType<GenericRepository<T>> {
  const prismaDelegateName = entityName.toLowerCase();
  @Injectable()
  class PrismaGenericRepository<T> implements GenericRepository<T> {
    constructor(private prisma: PrismaService) {}

    private get entityDelegate() {
      return this.prisma[prismaDelegateName];
    }

    async getAll(): Promise<T[]> {
      return this.entityDelegate.findMany();
    }

    async getOne(query: Partial<T>): Promise<T> {
      return this.entityDelegate.findFirst({ where: query });
    }

    async updateOne(query: Partial<T>, data: Partial<T>): Promise<T> {
      return this.entityDelegate.update({ where: query, data });
    }

    async deleteOne(query: Partial<T>): Promise<T> {
      return this.entityDelegate.delete({ where: query });
    }

    async create(data: Partial<T>): Promise<T> {
      return this.entityDelegate.create({ data });
    }
  }

  return PrismaGenericRepository;
}
