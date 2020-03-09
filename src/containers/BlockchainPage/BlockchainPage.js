import React, { Component } from 'react';
import { Helmet } from "react-helmet";

class BlockchainPage extends Component {
  render() {
    return (
      <div className="main-wrapper">
        <Helmet>
          <title>Blockchain – DeFi Blockchain Client</title>
        </Helmet>
        <header className="header-bar">
          <h1>Blockchain</h1>
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

export default BlockchainPage;