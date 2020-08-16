import {
  OrderedSet,
  fromArray,
  toArray,
  map,
  size,
  cons,
  add,
  remove,
} from "./OrderedSet";
import { eqNumber, eqBoolean } from "fp-ts/lib/Eq";

describe("OrderedSet.fromArray", () => {
  test("returns an OrderedSet of the unique values in the array", () => {
    const array = [1, 2, 1, 3, 2, 4, 4, 5, 3, 2, 6];

    const actual = fromArray(eqNumber)(array);

    const expected: OrderedSet<number> = {
      _type: "OrderedSet",
      values: [1, 2, 3, 4, 5, 6],
    };
    expect(actual).toEqual(expected);
  });
});

describe("OrderedSet.toArray", () => {
  test("returns the values as an array", () => {
    const set: OrderedSet<string> = {
      _type: "OrderedSet",
      values: ["a", "b", "c"],
    };

    const actual = toArray(set);

    const expected = ["a", "b", "c"];
    expect(actual).toEqual(expected);
  });
});

describe("OrderedSet.map", () => {
  test("applies the given function to the members preserving order", () => {
    const set: OrderedSet<number> = {
      _type: "OrderedSet",
      values: [1, 2, 3, 4, 5, 6],
    };
    const fn = (n: number): boolean => n % 2 === 0;

    const actual = map(eqBoolean)(fn)(set);

    const expected: OrderedSet<boolean> = {
      _type: "OrderedSet",
      values: [false, true],
    };
    expect(actual).toEqual(expected);
  });
});

describe("OrderedSet.size", () => {
  test("returns the size of the set", () => {
    const set: OrderedSet<string> = {
      _type: "OrderedSet",
      values: ["a", "b", "c"],
    };

    const actual = size(set);

    const expected = 3;
    expect(actual).toEqual(expected);
  });
});

describe("OrderedSet.cons", () => {
  test("adds an item to the start of the list", () => {
    const set: OrderedSet<number> = {
      _type: "OrderedSet",
      values: [1, 2, 3, 4],
    };

    const actual = cons(eqNumber)(3)(set);

    const expected: OrderedSet<number> = {
      _type: "OrderedSet",
      values: [3, 1, 2, 4],
    };
    expect(actual).toEqual(expected);
  });
});

describe("OrderedSet.add", () => {
  test("adds an item to the end of the list", () => {
    const set: OrderedSet<number> = {
      _type: "OrderedSet",
      values: [1, 2, 3, 4],
    };

    const actual = add(eqNumber)(5)(set);

    const expected: OrderedSet<number> = {
      _type: "OrderedSet",
      values: [1, 2, 3, 4, 5],
    };
    expect(actual).toEqual(expected);
  });

  test("does not add an item that is already in the list", () => {
    const set: OrderedSet<number> = {
      _type: "OrderedSet",
      values: [1, 2, 3, 4],
    };

    const actual = add(eqNumber)(2)(set);

    const expected: OrderedSet<number> = {
      _type: "OrderedSet",
      values: [1, 2, 3, 4],
    };
    expect(actual).toEqual(expected);
  });
});

describe("OrderedSet.remove", () => {
  test("removes an item from the list", () => {
    const set: OrderedSet<number> = {
      _type: "OrderedSet",
      values: [1, 2, 3, 4],
    };

    const actual = remove(eqNumber)(2)(set);

    const expected: OrderedSet<number> = {
      _type: "OrderedSet",
      values: [1, 3, 4],
    };
    expect(actual).toEqual(expected);
  });
});
