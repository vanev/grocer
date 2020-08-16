import * as React from "react";

interface Props {
  value: string;
  onChange: (description: string) => unknown;
}

const Description = ({ value, onChange }: Props) => (
  <input
    type="text"
    className="Item--Description"
    value={value}
    onChange={(event) => onChange(event.target.value)}
    placeholder="milk or eggs or whatever"
  />
);

export default Description;
