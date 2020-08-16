import "./style.scss";
import * as React from "react";
import { flow } from "fp-ts/function";
import { eqString } from "fp-ts/Eq";
import { isInProgress, isFailure } from "../../AsyncResult";
import { toArray, add, remove } from "../../OrderedSet";
import { GroceryList, ordering, name } from "../../GroceryList";
import useGroceryList from "../../hooks/useGroceryList";
import Text from "../Text";
import Name from "./Name";
import Items from "./Items";
import CreateItem from "./CreateItem";

interface Props {
  id: string;
}

const GroceryList = ({ id }: Props) => {
  const result = useGroceryList(id);

  if (isInProgress(result)) {
    return (
      <div className="GroceryList _loading">
        <Text>Loading...</Text>
      </div>
    );
  }

  if (isFailure(result)) {
    return (
      <div className="GroceryList _error">
        <Text>{result.error.message}</Text>
      </div>
    );
  }

  const [groceryList, update] = result.value;

  const onNameChange = flow(name.set, update);

  const onItemCreate = (id: string) =>
    update(ordering.modify(add(eqString)(id)));

  const onItemDelete = (id: string) => () =>
    update(ordering.modify(remove(eqString)(id)));

  return (
    <div className="GroceryList">
      <Name value={name.get(groceryList)} onChange={onNameChange} />

      <Items
        id={id}
        itemIds={flow(ordering.get, toArray)(groceryList)}
        onItemDelete={onItemDelete}
      />

      <CreateItem id={id} onCreate={onItemCreate} />
    </div>
  );
};

export default GroceryList;
