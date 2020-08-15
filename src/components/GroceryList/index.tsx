import "./style.scss";
import * as React from "react";
import { isInProgress, isFailure } from "../../AsyncResult";
import { GroceryList } from "../../GroceryList";
import useGroceryList from "../../hooks/useGroceryList";
import Name from "./Name";
import Items from "./Items";
import CreateItem from "./CreateItem";
import Text from "../Text";

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

  return (
    <div className="GroceryList">
      <Name groceryList={groceryList} update={update} />
      <Items groceryList={groceryList} update={update} id={id} />
      <CreateItem groceryList={groceryList} update={update} id={id} />
    </div>
  );
};

export default GroceryList;
