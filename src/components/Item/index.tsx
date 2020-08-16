import "./style.scss";
import * as React from "react";
import classnames from "classnames";
import { flow } from "fp-ts/function";
import { Option, isSome } from "fp-ts/Option";
import { isInProgress, isFailure } from "../../AsyncResult";
import { Item, completedAt, description } from "../../Item";
import tap from "../../tap";
import useItem from "../../hooks/useItem";
import Completed from "./Completed";
import Description from "./Description";
import Delete from "./Delete";

interface Props {
  listId: string;
  id: string;
  onChange?: (item: Item) => unknown;
  onDelete?: () => unknown;
}

const Item = ({
  listId,
  id,
  onChange = () => {},
  onDelete = () => {},
}: Props) => {
  const result = useItem(listId)(id);

  if (isInProgress(result)) {
    return <div className="Item _loading">Loading...</div>;
  }

  if (isFailure(result)) {
    return <div className="Item _error">{result.error.message}</div>;
  }

  const [item, update, ref] = result.value;

  const onCompletedAtChange = (value: Option<Date>) =>
    update(flow(completedAt.set(value), tap(onChange)));

  const onDescriptionChange = (value: string) =>
    update(flow(description.set(value), tap(onChange)));

  const onDeleteClick = () => {
    onDelete();
    ref.delete();
  };

  return (
    <li
      className={classnames(`Item`, {
        _completed: isSome(completedAt.get(item)),
      })}
    >
      <Completed
        value={completedAt.get(item)}
        onChange={onCompletedAtChange}
        id={id}
      />

      <Description
        value={description.get(item)}
        onChange={onDescriptionChange}
      />

      <Delete onClick={onDeleteClick} />
    </li>
  );
};

export default Item;
