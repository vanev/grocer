import * as React from "react";
import { Option, some, none, isSome } from "fp-ts/Option";

interface Props {
  id: string;
  value: Option<Date>;
  onChange: (completedAt: Option<Date>) => unknown;
}

const Completed = ({ id, value, onChange }: Props) => (
  <div className="Item--Completed">
    <input
      type="checkbox"
      checked={isSome(value)}
      onChange={() => onChange(isSome(value) ? none : some(new Date()))}
      id={id}
    />
    <label htmlFor={id} />
  </div>
);

export default Completed;
