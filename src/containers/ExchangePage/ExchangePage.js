import React, { Component } from 'react';
import { Helmet } from "react-helmet";

class ExchangePage extends Component {
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
          <section>
            Section
          </section>
        </div>
        <footer className="footer-bar">
          Footer Bar
        </footer>
      </div>
    );
  }
}

export default ExchangePage;