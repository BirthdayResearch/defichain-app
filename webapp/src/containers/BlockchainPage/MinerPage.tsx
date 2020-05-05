import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { Button } from "reactstrap";
import { MdArrowBack } from "react-icons/md";
import { NavLink, RouteComponentProps } from "react-router-dom";
import { I18n } from "react-redux-i18n";

interface MinerPageProps {}

interface MinerPageState {}

interface RouteParams {
  id?: string;
  height?: string;
}

class MinerPage extends Component<
  MinerPageProps & RouteComponentProps<RouteParams>,
  MinerPageState
> {
  render() {
    return (
      <div className="main-wrapper">
        <Helmet>
          <title>
            {I18n.t("containers.blockChainPage.minerPage.miner")}
            {`${this.props.match.params.id} –`}
            {I18n.t("containers.blockChainPage.minerPage.defiBlockChainClient")}
          </title>
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
