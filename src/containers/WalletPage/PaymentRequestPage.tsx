import React, { Component } from 'react';
import { Helmet } from "react-helmet";
import {
  Button,
  ButtonGroup
} from 'reactstrap';
import {
  MdArrowBack,
  MdDelete
} from "react-icons/md";
import { NavLink } from 'react-router-dom';
import KeyValueLi from '../../components/KeyValueLi/KeyValueLi';

class PaymentRequestPage extends Component<any,any> {
  state = {
    label: "TREQ 9876",
    amount: 1.5,
    time: "Feb 19, 2:03 pm",
    message: "Ref ID REQ456789",
    address: "bc1qnckyj0jxrcgtu4j90r0efcae750rfx6555rhaq",

  };

  render() {
    return (
      <div className="main-wrapper">
        <Helmet>
          <title>Payment request {this.props.match.params.id} – DeFi Blockchain Client</title>
        </Helmet>
        <header className="header-bar">
          <Button to="/" tag={NavLink} color="link" className="header-bar-back">
            <MdArrowBack />
            <span className="d-lg-inline">Wallet</span>
          </Button>
          <h1>Payment request {this.props.match.params.id}</h1>
          <ButtonGroup>
            <Button color="link">
              <MdDelete />
              <span>Delete</span>
            </Button>
          </ButtonGroup>
        </header>
        <div className="content">
          <section className="mb-5">
            <KeyValueLi label="Label" value={this.state.label} />
            <KeyValueLi label="Amount" value={this.state.amount} />
            <KeyValueLi label="Time" value={this.state.time} />
            <KeyValueLi label="Message" value={this.state.message} />
            <KeyValueLi label="Address" value={this.state.address} popsQR={true} copyable={true} uid="address" />
            <KeyValueLi label="URI" value={`
              bitcoin:${this.state.address}?amount=${this.state.amount}&label=${this.state.label}&message=${this.state.message}
            `} popsQR={true} copyable={true} uid="uri" />
          </section>
        </div>
      </div>
    );
  }
}

export default PaymentRequestPage;