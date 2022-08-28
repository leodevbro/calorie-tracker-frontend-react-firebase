import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./index.css";

import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter as BroRouter } from "react-router-dom";

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BroRouter>
        <App />
      </BroRouter>
    </Provider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

//
//
//
//
//
//
//
//

const objForBackButtonFunctions: { [key: string]: (e: PopStateEvent) => any } = {
  // fn1: () => console.log("pop1"),
  // fn2: () => console.log("pop2"),
};

export const addFnForBackButton = (key: string, fn: (e: PopStateEvent) => any) => {
  if (objForBackButtonFunctions.hasOwnProperty(key)) {
    // console.error(`objForBackButtonFunctions.hasOwnProperty(${key}) is true`);
  } else {
    objForBackButtonFunctions[key] = fn;
  }
};

export const removeFnForBackButton = (key: string) => {
  if (objForBackButtonFunctions.hasOwnProperty(key)) {
    delete objForBackButtonFunctions[key];
  } else {
    // console.log(`objForBackButtonFunctions.hasOwnProperty(${key}) is false already`);
  }
};

const generalFnForBackButton = (e: PopStateEvent) => {
  for (const key in objForBackButtonFunctions) {
    const currFn = objForBackButtonFunctions[key];
    currFn(e);
  }
};

window.addEventListener("popstate", generalFnForBackButton);
