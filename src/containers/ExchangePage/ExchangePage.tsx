import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { ExchangePageProps, ExchangePageState } from "./ExchangePage.interface";

class ExchangePage extends Component<ExchangePageProps, ExchangePageState> {
  render() {
    return (
      <div className="main-wrapper">
        <Helmet>
          <title>Exchange – DeFi Blockchain Client</title>
        </Helmet>
        <header className="header-bar">
          <h1>Exchange</h1>
        </header>
        <div className="content">
          <section>Section</section>
        </div>
        <footer className="footer-bar">Footer Bar</footer>
      </div>
    );
  }
}

export default ExchangePage;
