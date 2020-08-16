import * as React from "react";
import { useParams } from "react-router-dom";
import Page from "../components/Page";
import GroceryList from "../components/GroceryList";

interface Params {
  listId: string;
}

const List = () => {
  const { listId } = useParams<Params>();

  return (
    <Page>
      <GroceryList id={listId} />
    </Page>
  );
};

export default List;
