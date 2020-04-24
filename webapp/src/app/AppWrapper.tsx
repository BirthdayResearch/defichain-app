import React, { Component } from "react";
import { Provider } from "react-redux";
import store from "./rootStore";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

class AppLoader extends Component {
  render() {
    return (
      <BrowserRouter>
        <Provider store={store}>
          <App />
        </Provider>
      </BrowserRouter>
    );
  }
}

export default AppLoader;
