import * as React from "react";
import { useParams } from "react-router-dom";
import { isNone } from "fp-ts/Option";
import { fromString } from "../Id";
import useList from "../hooks/useList";
import GroceryList from "../components/GroceryList";

interface Params {
  listId: string;
}

const List = () => {
  const { listId } = useParams<Params>();
  const id = React.useMemo(() => fromString(listId), [listId]);
  const [maybeList, updateList] = useList(id);

  if (isNone(maybeList)) {
    return <div className="List _not-found">List not found.</div>;
  }

  return <GroceryList groceryList={maybeList.value} update={updateList} />;
};

export default List;
