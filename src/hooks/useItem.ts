import { useEffect, useState } from "react";
import { Item, decodeItem } from "../Item";
import {
  AsyncResult,
  inProgress,
  isSuccess,
  success,
  failure,
} from "../AsyncResult";
import { isFailure } from "../Result";
import Updater from "../Updater";
import useItemRef, { DocumentRef } from "./useItemRef";

type Bundle<T> = AsyncResult<[T, Updater<T>, DocumentRef]>;

const useItem = (listId: string) => (id: string): Bundle<Item> => {
  const ref = useItemRef(listId)(id);
  const [bundle, setBundle] = useState<Bundle<Item>>(inProgress);

  useEffect(() => {
    if (!isSuccess(ref)) return;

    return ref.value.onSnapshot((snap) => {
      const item = decodeItem(snap.data());

      if (isFailure(item)) return failure(item.left);

      const updater: Updater<Item> = (update) =>
        ref.value.update(update(item.right));

      setBundle(success([item.right, updater, ref.value]));
    });
  }, [id, ref]);

  return bundle;
};

export default useItem;
