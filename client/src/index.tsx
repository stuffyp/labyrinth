import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import { BrowserRouter } from "react-router-dom";

// renders React Component "Root" into the DOM element with ID "root"
ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);

// allows for live updating
if (module.hot !== undefined) {
  module.hot.accept();
}
