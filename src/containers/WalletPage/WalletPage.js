import React, { Component } from 'react';
import { Helmet } from "react-helmet";
import {
  Button,
  ButtonGroup,
  Row,
  Col,
} from 'reactstrap';
import {
  MdArrowUpward,
  MdArrowDownward
} from "react-icons/md";
import { NavLink as RRNavLink } from 'react-router-dom';
import StatCard from '../../components/StatCard/StatCard';
import WalletTxns from './WalletTxns';
import PaymentRequests from './PaymentRequests';

class WalletPage extends Component {
  state = {
    activeTab: 'txns'
  }

  setActiveTab = tab => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  render() {
    return (
      <div className="main-wrapper">
        <Helmet>
          <title>Wallet – DeFi Blockchain Client</title>
        </Helmet>
        <header className="header-bar">
          <h1>Wallet</h1>
          <ButtonGroup>
            <Button to="/wallet/send" tag={RRNavLink} color="link" size="sm">
              <MdArrowUpward />
              <span className="d-md-inline">Send</span>
            </Button>
            <Button to="/wallet/receive" tag={RRNavLink} color="link" size="sm">
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
            <h2>Payment requests</h2>
            <PaymentRequests />
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