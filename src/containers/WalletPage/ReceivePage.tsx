import React, { Component } from "react";
import { Helmet } from "react-helmet";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText
} from "reactstrap";
import { MdArrowBack } from "react-icons/md";
import { NavLink } from "react-router-dom";
import { ReceivePageProps, ReceivePageState } from "./WalletPage.interface";

class ReceivePage extends Component<ReceivePageProps, ReceivePageState> {
  state = {
    amountToReceive: "",
    amountToReceiveDisplayed: 0,
    receiveMessage: "",
    showBackdrop: "",
    receiveStep: "default"
  };

  updateAmountToReceive = e => {
    let amountToReceive =
      !isNaN(e.target.value) && e.target.value.length ? e.target.value : "";
    let amountToReceiveDisplayed =
      !isNaN(amountToReceive) && amountToReceive.length ? amountToReceive : "0";
    this.setState({
      amountToReceive: amountToReceive,
      amountToReceiveDisplayed: amountToReceiveDisplayed
    });
  };
  receiveStepConfirm = () => {};
  render() {
    return (
      <div className="main-wrapper">
        <Helmet>
          <title>Receive DFI – DeFi Blockchain Client</title>
        </Helmet>
        <header className="header-bar">
          <Button to="/" tag={NavLink} color="link" className="header-bar-back">
            <MdArrowBack />
            <span className="d-lg-inline">Wallet</span>
          </Button>
          <h1>Receive DFI</h1>
        </header>
        <div className="content">
          <section>
            <Form>
              <FormGroup className="form-label-group">
                <InputGroup>
                  <Input
                    type="text"
                    inputMode="numeric"
                    placeholder="Amount to Receive"
                    name="amountToReceive"
                    id="amountToReceive"
                    onChange={this.updateAmountToReceive}
                    autoFocus
                  />
                  <Label for="amountToReceive">Amount</Label>
                  <InputGroupAddon addonType="append">
                    <InputGroupText>DFI</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </FormGroup>
              <FormGroup className="form-label-group">
                <Input
                  type="textarea"
                  name="message"
                  id="message"
                  placeholder="Message"
                  rows="3"
                />
                <Label for="message">Message</Label>
              </FormGroup>
            </Form>
          </section>
        </div>
        <footer className="footer-bar">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <div className="caption-secondary">Amount to Receive</div>
              <div>{this.state.amountToReceiveDisplayed} DFI</div>
            </div>
            <div>
              <Button to="/wallet" tag={NavLink} color="link" className="mr-3">
                Cancel
              </Button>
              <Button
                color="primary"
                disabled={
                  !this.state.amountToReceive || !this.state.receiveMessage
                    ? true
                    : false
                }
                onClick={this.receiveStepConfirm}
              >
                {" "}
                Continue
              </Button>
            </div>
          </div>
        </footer>
      </div>
    );
  }
}

export default ReceivePage;
