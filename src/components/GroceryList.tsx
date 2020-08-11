import * as React from "react";
import { insertAt } from "fp-ts/Record";
import { flow } from "fp-ts/function";
import { eqId, toString } from "../Id";
import {
  nameLens,
  itemsLens,
  orderingLens,
  orderedItems,
  itemLens,
  GroceryList,
} from "../GroceryList";
import { create as createItem } from "../Item";
import { snoc } from "../OrderedSet";
import Item from "./Item";

interface Props {
  groceryList: GroceryList;
  update: (u: (g: GroceryList) => GroceryList) => unknown;
}

const Name = ({ groceryList, update }: Props) => (
  <input
    type="text"
    className="List--Name"
    placeholder="My Grocery List"
    value={nameLens.get(groceryList)}
    onChange={(event) => update(nameLens.set(event.target.value))}
  />
);

const Items = ({ groceryList, update }: Props) => (
  <ul className="List--Items">
    {orderedItems(groceryList).map((item) => (
      <Item
        item={item}
        update={(updater) => update(itemLens(item.id).modify(updater))}
        key={item.id.value}
      />
    ))}
  </ul>
);

const CreateItem = ({ groceryList, update }: Props) => (
  <button
    className="List--CreateItem"
    onClick={() => {
      const newItem = createItem(new Date());
      update(
        flow(
          itemsLens.modify(insertAt(toString(newItem.id), newItem)),
          orderingLens.modify(snoc(eqId)(newItem.id)),
        ),
      );
    }}
  >
    Add Item
  </button>
);

const GroceryList = ({ groceryList, update }: Props) => (
  <div className="List">
    <Name groceryList={groceryList} update={update} />
    <Items groceryList={groceryList} update={update} />
    <CreateItem groceryList={groceryList} update={update} />
  </div>
);

export default GroceryList;
