import * as React from "react";

interface Props {
  onClick: () => unknown;
}

const Delete = ({ onClick }: Props) => (
  <button className="Item--Delete" onClick={onClick}>
    ❌
  </button>
);

export default Delete;
