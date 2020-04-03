import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { Button } from "reactstrap";
import { MdArrowBack } from "react-icons/md";
import { NavLink, RouteComponentProps } from "react-router-dom";
import {
  MinerPageProps,
  MinerPageState,
  RouteParams
} from "./BlockchainPage.interface";

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
            <span className="d-lg-inline">Blockchain</span>
          </Button>
          <h1>Miner {this.props.match.params.id}</h1>
        </header>
        <div className="content">
          <section>Miner</section>
        </div>
      </div>
    );
  }
}

export default MinerPage;
