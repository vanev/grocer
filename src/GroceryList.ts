import { Option } from "fp-ts/Option";
import { lookup, insertAt } from "fp-ts/Record";
import { flow } from "fp-ts/function";
import { filterMap } from "fp-ts/Array";
import { Lens, Optional } from "monocle-ts";
import { Item, decodeItem } from "./Item";
import { OrderedSet, empty, toArray, decodeOrderedSet } from "./OrderedSet";
import { Decode as D } from "./JSON";

export interface GroceryList {
  _type: "GroceryList";
  createdAt: Date;
  name: string;
  ordering: OrderedSet<string>;
}

export const create = (createdAt: Date): GroceryList => ({
  _type: "GroceryList",
  createdAt,
  name: "",
  ordering: empty(),
});

export const decodeGroceryList = D.type<GroceryList>({
  _type: D.always<"GroceryList">("GroceryList"),
  createdAt: D.date,
  name: D.string,
  ordering: decodeOrderedSet(D.string),
});

const lens = Lens.fromProp<GroceryList>();

export const createdAt = lens("createdAt");
export const name = lens("name");
export const ordering = lens("ordering");

// export const itemLens = (id: Id) =>
//   itemsLens.composeOptional(Items.itemLens(id));

// export const orderedItems = (list: GroceryList): Array<Item> =>
//   flow(
//     orderingLens.get,
//     toArray,
//     filterMap((id: Id): Option<Item> => itemLens(id).getOption(list)),
//   )(list);
