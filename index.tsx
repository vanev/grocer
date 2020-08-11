import * as React from "react";
import { render } from "react-dom";
import Application from "./src/Application";

const nodeEl = window.document.querySelector("main");

render(<Application />, nodeEl);
