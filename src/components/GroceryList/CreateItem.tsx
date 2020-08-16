import * as React from "react";
import { create as createItem } from "../../Item";
import { isInProgress, isFailure } from "../../AsyncResult";
import useItemsRef from "../../hooks/useItemsRef";

interface Props {
  id: string;
  onCreate: (id: string) => unknown;
}

const CreateItem = ({ id, onCreate }: Props) => {
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
        const item = createItem(new Date());
        itemsRef.value.add(item).then((docRef) => onCreate(docRef.id));
      }}
    >
      Add Item
    </button>
  );
};

export default CreateItem;
