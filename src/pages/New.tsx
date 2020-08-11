import * as React from "react";
import { Redirect } from "react-router-dom";
import * as Id from "../Id";
import * as GroceryList from "../GroceryList";
import * as LocalStorage from "../LocalStorage";

const NewPage = () => {
  const newList = GroceryList.create(new Date());
  const listKey = Id.toString(newList.id);

  LocalStorage.setItem(listKey)(newList);

  return <Redirect to={`/${listKey}`} />;
};

export default NewPage;
