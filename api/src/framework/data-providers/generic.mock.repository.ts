import { PrismaService } from './prisma.service';
import { Injectable } from '@nestjs/common';
import {
  GenericRepository,
  RepositoryError,
} from 'src/core/data-providers/generic.repository';
import { Either, left, right } from 'src/core/logic/Either';

const genericCompare =
  <T>(query: Partial<T>) =>
  (data: T) =>
    Object.entries(query).every(([key, value]) => data[key] === value);

@Injectable()
export class MockGenericRepository<T> implements GenericRepository<T> {
  static DB = {};
  entityDelegate: any;

  constructor(private entityName: string) {
    MockGenericRepository.DB[entityName] =
      MockGenericRepository.DB[entityName] ?? [];
  }

  private get db(): T[] {
    return MockGenericRepository.DB[this.entityName];
  }

  private set db(data: T[]) {
    MockGenericRepository.DB[this.entityName] = data;
  }

  async getAll(): Promise<Either<RepositoryError, T[]>> {
    return right(this.db);
  }

  async getOne(query: Partial<T>): Promise<Either<RepositoryError, T>> {
    const one = this.db.find(genericCompare(query));

    return one ? right(one) : left(new Error('Not found'));
  }

  async updateOne(
    query: Partial<T>,
    data: Partial<T>,
  ): Promise<Either<RepositoryError, T>> {
    const oneIndex = this.db.findIndex(genericCompare(query));

    if (oneIndex === -1) {
      return left(new Error('Not found'));
    }

    this.db = this.db.filter((el, i) =>
      i === oneIndex ? [...(el as any), ...(data as any)] : el,
    );

    return right(this.db[oneIndex]);
  }

  async deleteOne(query: Partial<T>): Promise<Either<RepositoryError, T>> {
    const oneIndex = this.db.findIndex(genericCompare(query));

    if (oneIndex === -1) {
      return left(new Error('Not found'));
    }

    const one = this.db[oneIndex];

    this.db = this.db.reduce(
      (acc, el, i) => (i === oneIndex ? acc : [...acc, el]),
      [],
    );

    return right(one);
  }

  async create(data: Partial<T>): Promise<Either<RepositoryError, T>> {
    const value = data as T;

    this.db.push(value);

    return right(value);
  }
}
