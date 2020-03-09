import React, { Component } from 'react';
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
} from 'reactstrap';
import {
  MdArrowBack,
} from "react-icons/md";
import { NavLink } from 'react-router-dom';

class ReceivePage extends Component {
  state = {
    amountToReceive: 0
  };

  updateAmountToReceive = (e) => {
    let amountToReceive = e.target.value && !isNaN(e.target.value)  ? e.target.value : 0;
    this.setState({
      amountToReceive: amountToReceive
    })
  }

  render() {
    return (
      <div className="main-wrapper">
        <Helmet>
          <title>Receive DFI – DeFi Blockchain Client</title>
        </Helmet>
        <header className="header-bar">
          <Button to="/wallet" tag={NavLink} color="link" className="header-bar-back">
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
                    type="text" inputMode="numeric" placeholder="Amount to Receive"
                    name="amountToReceive" id="amountToReceive"
                    onChange={this.updateAmountToReceive}
                  />
                  <Label for="amountToReceive">Amount</Label>
                  <InputGroupAddon addonType="append">
                    <InputGroupText>DFI</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </FormGroup>
              <FormGroup className="form-label-group">
                <Input type="textarea" name="message" id="message" placeholder="Message" rows="3" />
                <Label for="message">Message</Label>
              </FormGroup>
            </Form>
          </section>
        </div>
        <footer className="footer-bar">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <div className="caption-secondary">Amount to Receive</div>
              <div>{this.state.amountToReceive} DFI</div>
            </div>
            <div>
              <Button to="/wallet" tag={NavLink} color="link" className="mr-3">Cancel</Button>
              <Button color="primary" disabled={true}>Continue</Button>
            </div>
          </div>
        </footer>
      </div>
    );
  }
}

export default ReceivePage;