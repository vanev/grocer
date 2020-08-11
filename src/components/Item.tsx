import * as React from "react";
import classnames from "classnames";
import { some, none, isSome } from "fp-ts/Option";
import { toString } from "../Id";
import { Item, descriptionLens, completedAtLens, deletedAtLens } from "../Item";

interface Props {
  item: Item;
  update: (updater: (current: Item) => Item) => unknown;
}

const Completed = ({ item, update }: Props) => (
  <div className="List--Item--Completed">
    <input
      type="checkbox"
      checked={isSome(completedAtLens.get(item))}
      onChange={() =>
        update(
          completedAtLens.modify((completedAt) =>
            isSome(completedAt) ? none : some(new Date()),
          ),
        )
      }
      id={toString(item.id)}
    />
    <label htmlFor={toString(item.id)} />
  </div>
);

const Description = ({ item, update }: Props) => (
  <input
    type="text"
    className="List--Item--Description"
    value={descriptionLens.get(item)}
    onChange={(event) => update(descriptionLens.set(event.target.value))}
    placeholder="milk or eggs or whatever"
  />
);

const Deleted = ({ item, update }: Props) => (
  <button
    className="List--Item--Deleted"
    onClick={() =>
      update(
        deletedAtLens.modify((deletedAt) =>
          isSome(deletedAt) ? none : some(new Date()),
        ),
      )
    }
  >
    ❌
  </button>
);

const Item = ({ item, update }: Props) => (
  <li
    className={classnames(`List--Item`, {
      _completed: isSome(completedAtLens.get(item)),
      _deleted: isSome(deletedAtLens.get(item)),
    })}
  >
    <Completed item={item} update={update} />
    <Description item={item} update={update} />
    <Deleted item={item} update={update} />
  </li>
);

export default Item;
