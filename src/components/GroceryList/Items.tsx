import * as React from "react";
import { map } from "fp-ts/Array";
import { Item } from "../../Item";
import ItemComponent from "../Item";

interface Props {
  id: string;
  itemIds: Array<string>;
  onItemChange?: (id: string) => (item: Item) => unknown;
  onItemDelete?: (id: string) => () => unknown;
}

const Items = ({
  id,
  itemIds,
  onItemChange = () => () => {},
  onItemDelete = () => () => {},
}: Props) => (
  <ul className="GroceryList--Items">
    {map((itemId: string) => (
      <ItemComponent
        key={itemId}
        listId={id}
        id={itemId}
        onChange={onItemChange(itemId)}
        onDelete={onItemDelete(itemId)}
      />
    ))(itemIds)}
  </ul>
);

export default Items;
