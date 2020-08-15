import "./style.scss";
import * as React from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
}

const Page = ({ children, className }: Props) => (
  <div className={`Page ${className}`}>{children}</div>
);

export default Page;
