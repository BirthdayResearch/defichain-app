import React, { Component } from 'react';
import { Helmet } from "react-helmet";
import BlockchainTable from './BlockchainTable';

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
          <section className="mb-0">
            <BlockchainTable />
          </section>
        </div>
      </div>
    );
  }
}

export default BlockchainPage;