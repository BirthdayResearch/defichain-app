import React, { Component } from "react";
import { Helmet } from "react-helmet";
import BlockchainTable from "./BlockchainTable";
import { I18n } from "react-redux-i18n";

interface BlockchainPageProps {}

interface BlockchainPageState {}

class BlockchainPage extends Component<
  BlockchainPageProps,
  BlockchainPageState
> {
  render() {
    return (
      <div className="main-wrapper">
        <Helmet>
          <title>
            {I18n.t("containers.blockChainPage.blockChainPage.title")}
          </title>
        </Helmet>
        <header className="header-bar">
          <h1>
            {I18n.t("containers.blockChainPage.blockChainPage.blockchain")}
          </h1>
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
