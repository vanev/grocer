import "./style.scss";
import * as React from "react";

interface Props {
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  children: React.ReactNode;
}

const Text = ({ as: As = "p", className, children }: Props) => (
  <As className={`Text ${className}`}>{children}</As>
);

export default Text;
