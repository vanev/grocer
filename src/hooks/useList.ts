import { useState, useEffect } from "react";
import { flow } from "fp-ts/function";
import { Option, none, fromEither, map, isSome } from "fp-ts/Option";
import { chain } from "fp-ts/Either";
import { Id, toString } from "../Id";
import { GroceryList, decodeGroceryList } from "../GroceryList";
import { getItem, setItem } from "../LocalStorage";

type Update<T> = (updater: (current: T) => T) => unknown;

const useList = (id: Id): [Option<GroceryList>, Update<GroceryList>] => {
  const [list, setList] = useState<Option<GroceryList>>(none);

  const updateList: Update<GroceryList> = (updater) => {
    const newList = map(updater)(list);

    setList(newList);

    if (isSome(newList)) {
      setItem(toString(id))(newList.value);
    }
  };

  useEffect(() => {
    flow(toString, getItem, chain(decodeGroceryList), fromEither, setList)(id);
  }, [id]);

  return [list, updateList];
};

export default useList;
