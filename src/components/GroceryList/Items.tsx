import * as React from "react";
import { map } from "fp-ts/Array";
import { flow } from "fp-ts/function";
import { GroceryList, orderingLens } from "../../GroceryList";
import { toArray } from "../../OrderedSet";
import Updater from "../../Updater";
import Item from "../Item";

interface Props {
  groceryList: GroceryList;
  update: Updater<GroceryList>;
  id: string;
}

const Items = ({ groceryList, id }: Props) => {
  const renderItems = flow(
    orderingLens.get,
    toArray,
    map((itemId) => <Item key={itemId} listId={id} id={itemId} />),
  );

  return <ul className="GroceryList--Items">{renderItems(groceryList)}</ul>;
};

export default Items;
