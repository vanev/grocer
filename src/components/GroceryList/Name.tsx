import * as React from "react";
import { flow } from "fp-ts/function";
import { GroceryList, nameLens } from "../../GroceryList";
import Updater from "../../Updater";

interface Props {
  groceryList: GroceryList;
  update: Updater<GroceryList>;
}

const getTargetValue = (event: React.ChangeEvent<HTMLInputElement>) =>
  event.target.value;

const Name = ({ groceryList, update }: Props) => (
  <input
    type="text"
    className="GroceryList--Name"
    placeholder="My Grocery List"
    value={nameLens.get(groceryList)}
    onChange={flow(getTargetValue, nameLens.set, update)}
  />
);

export default Name;
