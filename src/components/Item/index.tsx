import "./style.scss";
import * as React from "react";
import classnames from "classnames";
import { isSome } from "fp-ts/Option";
import { isInProgress, isFailure } from "../../AsyncResult";
import { Item, completedAtLens, deletedAtLens } from "../../Item";
import useItem from "../../hooks/useItem";
import Completed from "./Completed";
import Description from "./Description";
import Deleted from "./Deleted";

interface Props {
  listId: string;
  id: string;
}

const Item = ({ listId, id }: Props) => {
  const result = useItem(listId)(id);

  if (isInProgress(result)) {
    return <div className="Item _loading">Loading...</div>;
  }

  if (isFailure(result)) {
    return <div className="Item _error">{result.error.message}</div>;
  }

  const [item, update] = result.value;

  return (
    <li
      className={classnames(`Item`, {
        _completed: isSome(completedAtLens.get(item)),
        _deleted: isSome(deletedAtLens.get(item)),
      })}
    >
      <Completed item={item} update={update} id={id} />
      <Description item={item} update={update} />
      <Deleted item={item} update={update} />
    </li>
  );
};

export default Item;
