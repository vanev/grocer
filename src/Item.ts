import { Lens } from "monocle-ts";
import { Option, none } from "fp-ts/Option";
import { Decode as D } from "./JSON";

export interface Item {
  _type: "Item";
  completedAt: Option<Date>;
  createdAt: Date;
  deletedAt: Option<Date>;
  description: string;
}

export const create = (createdAt: Date): Item => ({
  _type: "Item",
  completedAt: none,
  createdAt,
  deletedAt: none,
  description: "",
});

export const decodeItem = D.type<Item>({
  _type: D.always<"Item">("Item"),
  completedAt: D.option(D.date),
  createdAt: D.date,
  deletedAt: D.option(D.date),
  description: D.string,
});

const lens = Lens.fromProp<Item>();

export const completedAtLens = lens("completedAt");
export const createdAtLens = lens("createdAt");
export const deletedAtLens = lens("deletedAt");
export const descriptionLens = lens("description");
