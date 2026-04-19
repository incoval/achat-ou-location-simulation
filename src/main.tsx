import React from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";
import { Simulator } from "./Simulator";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Simulator />
  </React.StrictMode>,
);
