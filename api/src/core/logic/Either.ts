export interface Left<L> {
  readonly _tag: 'Left';
  readonly value: L;
}

export interface Right<R> {
  readonly _tag: 'Right';
  readonly value: R;
}

export type Either<L, R> = Left<L> | Right<R>;

export const isLeft = <L>(either: Either<L, unknown>): either is Left<L> =>
  either._tag === 'Left';

export const isRight = <R>(either: Either<unknown, R>): either is Right<R> =>
  either._tag === 'Right';

export const left = <L, R = never>(value: L): Either<L, R> => ({
  _tag: 'Left',
  value,
});

export const right = <R, L = never>(value: R): Either<L, R> => ({
  _tag: 'Right',
  value,
});

export const mapRight = <L, R, S>(
  either: Either<L, R>,
  fn: (a: R) => S,
): Either<L, S> => (isRight(either) ? right(fn(either.value)) : either);

export const mapLeft = <L, R, M>(
    either: Either<L, R>,
  fn: (e: L) => M,
): Either<M, R> => (isLeft(either) ? left(fn(either.value)) : either);
