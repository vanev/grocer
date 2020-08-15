import * as React from "react";
import { Item, descriptionLens } from "../../Item";
import Updater from "../../Updater";

interface Props {
  item: Item;
  update: Updater<Item>;
}

const Description = ({ item, update }: Props) => (
  <input
    type="text"
    className="Item--Description"
    value={descriptionLens.get(item)}
    onChange={(event) => update(descriptionLens.set(event.target.value))}
    placeholder="milk or eggs or whatever"
  />
);

export default Description;
