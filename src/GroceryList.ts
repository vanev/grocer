import { Option } from "fp-ts/Option";
import { lookup, insertAt } from "fp-ts/Record";
import { flow } from "fp-ts/function";
import { filterMap } from "fp-ts/Array";
import { Lens, Optional } from "monocle-ts";
import { Id, fromNumber, decodeId, toString } from "./Id";
import { Item, decodeItem } from "./Item";
import { OrderedSet, empty, toArray, decodeOrderedSet } from "./OrderedSet";
import { Decode as D } from "./JSON";

namespace Items {
  export type Items = Record<string, Item>;

  export const itemLens = (id: Id): Optional<Items, Item> =>
    new Optional(lookup(toString(id)), (a) => insertAt(toString(id), a));
}

export interface GroceryList {
  _type: "GroceryList";
  createdAt: Date;
  id: Id;
  items: Items.Items;
  name: string;
  ordering: OrderedSet<Id>;
}

export const create = (createdAt: Date): GroceryList => ({
  _type: "GroceryList",
  createdAt,
  id: fromNumber(createdAt.valueOf()),
  items: {},
  name: "",
  ordering: empty(),
});

export const decodeGroceryList = D.type<GroceryList>({
  _type: D.always<"GroceryList">("GroceryList"),
  createdAt: D.date,
  id: decodeId,
  items: D.record(D.string, decodeItem),
  name: D.string,
  ordering: decodeOrderedSet(decodeId),
});

const lens = Lens.fromProp<GroceryList>();

export const createdAtLens = lens("createdAt");
export const idLens = lens("id");
export const itemsLens = lens("items");
export const nameLens = lens("name");
export const orderingLens = lens("ordering");

export const itemLens = (id: Id) =>
  itemsLens.composeOptional(Items.itemLens(id));

export const orderedItems = (list: GroceryList): Array<Item> =>
  flow(
    orderingLens.get,
    toArray,
    filterMap((id: Id): Option<Item> => itemLens(id).getOption(list)),
  )(list);
