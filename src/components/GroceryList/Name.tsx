import * as React from "react";

interface Props {
  value: string;
  onChange: (name: string) => unknown;
}

const Name = ({ value, onChange }: Props) => (
  <input
    type="text"
    className="GroceryList--Name"
    placeholder="My Grocery List"
    value={value}
    onChange={(event) => onChange(event.target.value)}
  />
);

export default Name;
