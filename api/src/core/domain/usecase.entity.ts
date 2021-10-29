export interface UseCase<D, P, R> {
  (dependencies: D): (properties: P) => R;
}

export type UseCaseInstance<U extends UseCase<any, any, any>> = ReturnType<U>;
