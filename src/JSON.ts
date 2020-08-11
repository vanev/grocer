import { empty } from "fp-ts/Record";
import { Option, none, some } from "fp-ts/Option";
import { map } from "fp-ts/Either";
import { Result, success, failure, isSuccess, isFailure } from "./Result";

export const parse = (json: string): Result<unknown> => {
  try {
    return success(JSON.parse(json));
  } catch (e) {
    return failure(e);
  }
};

export const stringify = (a: unknown): string => JSON.stringify(a);

export namespace Decode {
  export class DecodeError extends Error {
    constructor(type: string, json: any) {
      super(`Could not decode ${json} as ${type}.`);
    }
  }

  export type Decoder<T> = (json: any) => Result<T>;

  export const always = <T>(value: T): Decoder<T> => (_) => success(value);

  export const date: Decoder<Date> = (json) => {
    if (json instanceof Date) return success(json);
    if (typeof json === "string") return success(new Date(json));
    return failure(new DecodeError("Date", json));
  };

  export const string: Decoder<string> = (json) => {
    if (typeof json === "string") return success(json);
    return failure(new DecodeError("String", json));
  };

  export const number: Decoder<number> = (json) => {
    if (typeof json === "number") return success(json);
    return failure(new DecodeError("Number", json));
  };

  export const option = <T>(decodeT: Decoder<T>): Decoder<Option<T>> => (
    json,
  ) => {
    if (!json || json._tag === "None") return success(none);
    return map<T, Option<T>>(some)(decodeT(json.value));
  };

  export const oneOf = <A, B>(
    decodeA: Decoder<A>,
    decodeB: Decoder<B>,
  ): Decoder<A | B> => (json) => {
    const aResult = decodeA(json);
    if (isSuccess(aResult)) return aResult;

    const bResult = decodeB(json);
    return bResult;
  };

  export const type = <T>(
    decoders: {
      [A in keyof T]: Decoder<T[A]>;
    },
  ): Decoder<T> => (json) => {
    const final = {} as T;
    for (const key in decoders) {
      const decoder = decoders[key];
      const result = decoder(json[key]);
      if (isFailure(result)) return result;
      final[key] = result.right;
    }
    return success(final);
  };

  export const record = <K extends string, V>(
    decodeKey: Decoder<K>,
    decodeValue: Decoder<V>,
  ): Decoder<Record<K, V>> => (json) => {
    const result: Record<K, V> = empty;
    for (const key in json) {
      const keyResult = decodeKey(key);
      if (isFailure(keyResult)) return keyResult;

      const valueResult = decodeValue(json[key]);
      if (isFailure(valueResult)) return valueResult;

      result[keyResult.right] = valueResult.right;
    }
    return success(result);
  };

  export const array = <T>(decodeT: Decoder<T>): Decoder<Array<T>> => (
    json,
  ) => {
    if (!(json instanceof Array))
      return failure(new DecodeError("Array", json));

    const result: Array<T> = [];
    for (const t of json) {
      const tResult = decodeT(t);
      if (isFailure(tResult)) return tResult;

      result.push(tResult.right);
    }

    return success(result);
  };
}
