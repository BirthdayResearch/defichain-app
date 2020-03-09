import React, { Component } from 'react';
import { Helmet } from "react-helmet";
import {
  Button,
  ButtonGroup,
  Row,
  Col
} from 'reactstrap';
import {
  MdArrowUpward,
  MdArrowDownward
} from "react-icons/md";
import { NavLink } from 'react-router-dom';
import StatCard from '../../components/StatCard/StatCard';
import WalletTxns from '../../components/WalletTxns/WalletTxns';

class WalletPage extends Component {
  render() {
    return (
      <div className="main-wrapper">
        <Helmet>
          <title>Wallet – DeFi Blockchain Client</title>
        </Helmet>
        <header className="header-bar">
          <h1>Wallet</h1>
          <ButtonGroup>
            <Button to="/wallet/send" tag={NavLink} color="link" size="sm">
              <MdArrowUpward />
              <span className="d-md-inline">Send</span>
            </Button>
            <Button to="/wallet/receive" tag={NavLink} color="link" size="sm">
              <MdArrowDownward />
              <span className="d-md-inline">Receive</span>
            </Button>
          </ButtonGroup>
        </header>
        <div className="content">
          <section>
            <Row>
              <Col>
                <StatCard label="Available balance" value="1,000" unit="DFI" />
              </Col>
              <Col>
                <StatCard label="Pending" value="1,000" unit="DFI" />
              </Col>
            </Row>
          </section>
          <section>
            <h2>Transactions</h2>
            <WalletTxns />
          </section>
        </div>
      </div>
    );
  }
}

export default WalletPage;