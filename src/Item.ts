import { Lens } from "monocle-ts";
import { Option, none } from "fp-ts/Option";
import { Id, fromNumber, decodeId } from "./Id";
import { Decode as D } from "./JSON";

export interface Item {
  _type: "Item";
  completedAt: Option<Date>;
  createdAt: Date;
  deletedAt: Option<Date>;
  description: string;
  id: Id;
}

export const create = (createdAt: Date): Item => ({
  _type: "Item",
  completedAt: none,
  createdAt,
  deletedAt: none,
  description: "",
  id: fromNumber(createdAt.valueOf()),
});

export const decodeItem = D.type<Item>({
  _type: D.always<"Item">("Item"),
  completedAt: D.option(D.date),
  createdAt: D.date,
  deletedAt: D.option(D.date),
  description: D.string,
  id: decodeId,
});

const lens = Lens.fromProp<Item>();

export const completedAtLens = lens("completedAt");
export const createdAtLens = lens("createdAt");
export const deletedAtLens = lens("deletedAt");
export const descriptionLens = lens("description");
export const idLens = lens("id");
