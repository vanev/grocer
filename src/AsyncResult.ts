import { Either, isLeft } from "fp-ts/Either";

export type Success<T> = { _tag: "Success"; value: T };
export const success = <T>(value: T): Success<T> => ({
  _tag: "Success",
  value,
});

export type Failure = { _tag: "Failure"; error: Error };
export const failure = (error: Error): Failure => ({ _tag: "Failure", error });

export type InProgress = { _tag: "InProgress" };
export const inProgress: InProgress = { _tag: "InProgress" };

export type AsyncResult<T> = Success<T> | Failure | InProgress;

export const isSuccess = <T>(a: AsyncResult<T>): a is Success<T> =>
  a._tag === "Success";

export const isFailure = <T>(a: AsyncResult<T>): a is Failure =>
  a._tag === "Failure";

export const isInProgress = <T>(a: AsyncResult<T>): a is InProgress =>
  a._tag === "InProgress";

export const fromEither = <T>(either: Either<Error, T>): AsyncResult<T> => {
  if (isLeft(either)) return failure(either.left);
  return success(either.right);
};

export const map = <A, B>(f: (a: A) => B) => (
  ara: AsyncResult<A>,
): AsyncResult<B> => {
  if (isSuccess(ara)) return success(f(ara.value));
  return ara;
};
