import * as React from "react";
import { some, none, isSome } from "fp-ts/Option";
import { Item, deletedAtLens } from "../../Item";
import Updater from "../../Updater";

interface Props {
  item: Item;
  update: Updater<Item>;
}

const Deleted = ({ item, update }: Props) => (
  <button
    className="Item--Deleted"
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

export default Deleted;
