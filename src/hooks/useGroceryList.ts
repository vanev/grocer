import { useEffect, useState } from "react";
import { GroceryList, decodeGroceryList } from "../GroceryList";
import {
  AsyncResult,
  inProgress,
  isSuccess,
  success,
  failure,
} from "../AsyncResult";
import { isFailure } from "../Result";
import Updater from "../Updater";
import useGroceryListRef from "./useGroceryListRef";

type Bundle<T> = AsyncResult<[T, Updater<T>]>;

const useGroceryList = (id: string): Bundle<GroceryList> => {
  const ref = useGroceryListRef(id);
  const [bundle, setBundle] = useState<Bundle<GroceryList>>(inProgress);

  useEffect(() => {
    if (!isSuccess(ref)) return;

    return ref.value.onSnapshot((snap) => {
      const groceryList = decodeGroceryList(snap.data());

      if (isFailure(groceryList)) return failure(groceryList.left);

      const updater: Updater<GroceryList> = (update) =>
        ref.value.update(update(groceryList.right));

      setBundle(success([groceryList.right, updater]));
    });
  }, [id, ref]);

  return bundle;
};

export default useGroceryList;
