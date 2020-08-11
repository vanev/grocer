import { Either, right, left, isRight, isLeft } from "fp-ts/Either";

export type Result<T> = Either<Error, T>;

export const success = right;
export const failure = left;

export const isSuccess = isRight;
export const isFailure = isLeft;
