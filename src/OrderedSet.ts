import {
  uniq,
  map as arrayMap,
  filter as arrayFilter,
  head as arrayHead,
  last as arrayLast,
  init as arrayInit,
  tail as arrayTail,
  cons as arrayCons,
  snoc as arraySnoc,
} from "fp-ts/Array";
import { Eq } from "fp-ts/Eq";
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

export const head = flow(toArray, arrayHead);
export const last = flow(toArray, arrayLast);
export const init = flow(toArray, arrayInit);
export const tail = flow(toArray, arrayTail);

export const cons = <A>(eq: Eq<A>) => (
  a: A,
): ((o: OrderedSet<A>) => OrderedSet<A>) =>
  flow(toArray, arrayCons(a), fromArray(eq));

export const add = <A>(eq: Eq<A>) => (
  a: A,
): ((o: OrderedSet<A>) => OrderedSet<A>) =>
  flow(toArray, (as) => arraySnoc(as, a), fromArray(eq));

export const remove = <A>(eq: Eq<A>) => (
  a: A,
): ((o: OrderedSet<A>) => OrderedSet<A>) =>
  flow(
    toArray,
    arrayFilter((value) => !eq.equals(a, value)),
    fromArray(eq),
  );
