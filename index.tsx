import * as React from "react";
import { render } from "react-dom";
import Application from "./src/Application";

const nodeEl = window.document.querySelector("#app");

render(<Application />, nodeEl);
