import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { Button } from "reactstrap";
import { MdArrowBack } from "react-icons/md";
import { NavLink, RouteComponentProps } from "react-router-dom";
import {
  MinerPageProps,
  MinerPageState,
  RouteParams,
} from "./BlockchainPage.interface";
import { I18n } from "react-redux-i18n";

class MinerPage extends Component<
  MinerPageProps & RouteComponentProps<RouteParams>,
  MinerPageState
> {
  render() {
    return (
      <div className="main-wrapper">
        <Helmet>
          <title>{`Miner ${this.props.match.params.id} – DeFi Blockchain Client`}</title>
        </Helmet>
        <header className="header-bar">
          <Button
            to="/blockchain"
            tag={NavLink}
            color="link"
            className="header-bar-back"
          >
            <MdArrowBack />
            <span className="d-lg-inline">
              {I18n.t("containers.blockChainPage.minerPage.blockchain")}
            </span>
          </Button>
          <h1>
            {I18n.t("containers.blockChainPage.minerPage.miner")}&nbsp;
            {this.props.match.params.id}
          </h1>
        </header>
        <div className="content">
          <section>
            {I18n.t("containers.blockChainPage.minerPage.miner")}
          </section>
        </div>
      </div>
    );
  }
}

export default MinerPage;
