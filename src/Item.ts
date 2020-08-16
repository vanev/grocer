import { Lens } from "monocle-ts";
import { Option, none } from "fp-ts/Option";
import { Decode as D } from "./JSON";

export interface Item {
  _type: "Item";
  completedAt: Option<Date>;
  createdAt: Date;
  description: string;
}

export const create = (createdAt: Date): Item => ({
  _type: "Item",
  completedAt: none,
  createdAt,
  description: "",
});

export const decodeItem = D.type<Item>({
  _type: D.always<"Item">("Item"),
  completedAt: D.option(D.date),
  createdAt: D.date,
  description: D.string,
});

const lens = Lens.fromProp<Item>();

export const completedAt = lens("completedAt");
export const createdAt = lens("createdAt");
export const description = lens("description");
