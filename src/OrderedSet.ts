import {
  uniq,
  map as arrayMap,
  filter as arrayFilter,
  last as arrayLast,
} from "fp-ts/Array";
import { Eq } from "fp-ts/Eq";
import { Option } from "fp-ts/Option";
import { flow } from "fp-ts/function";
import { Decode as D } from "./JSON";

export type OrderedSet<T> = {
  _type: "OrderedSet";
  values: Array<T>;
};

export const fromArray = <A>(eq: Eq<A>) => (arr: Array<A>): OrderedSet<A> => ({
  _type: "OrderedSet",
  values: uniq(eq)(arr),
});

export const empty = <A>(): OrderedSet<A> => ({
  _type: "OrderedSet",
  values: [],
});

export const toArray = <A>(o: OrderedSet<A>): Array<A> => o.values;

export const map = <A, B>(eq: Eq<B>) => (fn: (a: A) => B) =>
  flow(toArray, arrayMap(fn), fromArray(eq));

export const decodeOrderedSet = <T>(decodeT: D.Decoder<T>) =>
  D.type<OrderedSet<T>>({
    _type: D.always<"OrderedSet">("OrderedSet"),
    values: D.array(decodeT),
  });

export const size = <T>(osa: OrderedSet<T>): number => osa.values.length;

export const last = <A>(osa: OrderedSet<A>): Option<A> => arrayLast(osa.values);

export const snoc = <A>(eq: Eq<A>) => (a: A) => (
  osa: OrderedSet<A>,
): OrderedSet<A> =>
  fromArray(eq)([...arrayFilter((x: A) => x !== a)(osa.values), a]);
