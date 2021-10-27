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
export class InMemoryGenericRepository<T> implements GenericRepository<T> {
  static DB = {};
  entityDelegate: any;

  constructor(private entityName: string) {
    InMemoryGenericRepository.DB[entityName] =
      InMemoryGenericRepository.DB[entityName] ?? [];
  }

  private get db(): T[] {
    return InMemoryGenericRepository.DB[this.entityName];
  }

  private set db(data: T[]) {
    InMemoryGenericRepository.DB[this.entityName] = data;
  }

  async getAll(query?: Partial<T>): Promise<Either<RepositoryError, T[]>> {
    return query
      ? right(this.db.filter(genericCompare(query)))
      : right(this.db);
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

    this.db = this.db.map((el, i) =>
      i === oneIndex ? { ...el, ...data } : el,
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
