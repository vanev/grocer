import { parse, stringify } from "./JSON";
import { Result, success, failure } from "./Result";

export const getItem = (key: string): Result<unknown> => {
  try {
    const value = window.localStorage.getItem(key);
    return parse(value);
  } catch (e) {
    return failure(e);
  }
};

export const setItem = (key: string) => (value: unknown): Result<string> => {
  try {
    const stringifiedValue = stringify(value);
    window.localStorage.setItem(key, stringifiedValue);
    return success(stringifiedValue);
  } catch (e) {
    failure(e);
  }
};
