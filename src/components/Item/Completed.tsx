import * as React from "react";
import { some, none, isSome } from "fp-ts/Option";
import { Item, completedAtLens } from "../../Item";
import Updater from "../../Updater";

interface Props {
  item: Item;
  update: Updater<Item>;
  id: string;
}

const Completed = ({ item, update, id }: Props) => (
  <div className="Item--Completed">
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
      id={id}
    />
    <label htmlFor={id} />
  </div>
);

export default Completed;
