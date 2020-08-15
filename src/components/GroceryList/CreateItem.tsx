import * as React from "react";
import { flow } from "fp-ts/function";
import { eqString } from "fp-ts/Eq";
import { GroceryList, orderingLens } from "../../GroceryList";
import Updater from "../../Updater";
import { create as createItem } from "../../Item";
import { isInProgress, isFailure } from "../../AsyncResult";
import { snoc } from "../../OrderedSet";
import useItemsRef from "../../hooks/useItemsRef";

interface Props {
  groceryList: GroceryList;
  update: Updater<GroceryList>;
  id: string;
}

const CreateItem = ({ groceryList, update, id }: Props) => {
  const itemsRef = useItemsRef(id);

  if (isInProgress(itemsRef)) {
    return (
      <button className="GroceryList--CreateItem _loading" disabled={true}>
        Loading...
      </button>
    );
  }

  if (isFailure(itemsRef)) {
    return (
      <button className="GroceryList--CreateItem _error" disabled={true}>
        {itemsRef.error}
      </button>
    );
  }

  return (
    <button
      className="GroceryList--CreateItem"
      onClick={() => {
        itemsRef.value.add(createItem(new Date())).then((docRef) => {
          update(flow(orderingLens.modify(snoc(eqString)(docRef.id))));
        });
      }}
    >
      Add Item
    </button>
  );
};

export default CreateItem;
