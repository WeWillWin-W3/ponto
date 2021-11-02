import { Either, mapLeft } from '../logic/Either';
export interface RepositoryError extends Error {
  message: string;
}

export const RepositoryErrorFormatter = (err: RepositoryError) => ({
  message: `RepositoryError: ${err.message}`,
});

export const RepositoryErrorFilter = <T>(either: Either<RepositoryError, T>) =>
  mapLeft(either, RepositoryErrorFormatter);

export interface GenericRepository<T> {
  getAll(query?: Partial<T>): Promise<Either<RepositoryError, T[]>>;
  getOne(query: Partial<T>): Promise<Either<RepositoryError, T>>;
  updateOne(
    query: Partial<T>,
    data: Partial<T>,
  ): Promise<Either<RepositoryError, T>>;
  deleteOne(query: Partial<T>): Promise<Either<RepositoryError, T>>;
  create(data: Partial<T>): Promise<Either<RepositoryError, T>>;
}
