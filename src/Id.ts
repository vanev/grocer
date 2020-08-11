import { Eq } from "fp-ts/Eq";
import { Decode as D } from "./JSON";

export type Id = {
  _type: "Id";
  value: string | number;
};

export const fromString = (value: string): Id => ({
  _type: "Id",
  value,
});

export const fromNumber = (value: number): Id => ({
  _type: "Id",
  value,
});

export const toString = (a: Id) => a.value.toString();

export const eqId: Eq<Id> = {
  equals: (a, b) => toString(a) === toString(b),
};

export const decodeId = D.type<Id>({
  _type: D.always<"Id">("Id"),
  value: D.oneOf(D.string, D.number),
});
