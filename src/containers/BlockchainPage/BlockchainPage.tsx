import React, { Component } from "react";
import { Helmet } from "react-helmet";
import BlockchainTable from "./BlockchainTable";
import {
  BlockchainPageProps,
  BlockchainPageState
} from "./BlockchainPage.interface";

class BlockchainPage extends Component<
  BlockchainPageProps,
  BlockchainPageState
> {
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
