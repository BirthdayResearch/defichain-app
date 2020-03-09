import React, { Component } from 'react';
import { Helmet } from "react-helmet";
import {
  Col,
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
  MdCropFree
} from "react-icons/md";
import { NavLink } from 'react-router-dom';

class SendPage extends Component {
  state = {
    amountToSend: 0
  };

  updateAmountToSend = (e) => {
    let amountToSend = e.target.value && !isNaN(e.target.value) ? e.target.value : 0;
    this.setState({
      amountToSend: amountToSend
    })
  }

  render() {
    return (
      <div className="main-wrapper">
        <Helmet>
          <title>Send DFI – DeFi Blockchain Client</title>
        </Helmet>
        <header className="header-bar">
          <Button to="/wallet" tag={NavLink} color="link" className="header-bar-back">
            <MdArrowBack />
            <span className="d-lg-inline">Wallet</span>
          </Button>
          <h1>Send DFI</h1>
        </header>
        <div className="content">
          <section>
            <Form>
              <FormGroup className="form-label-group form-row">
                <Col>
                  <InputGroup>
                    <Input
                      type="text" inputMode="numeric" placeholder="Amount to Send"
                      name="amountToSend" id="amountToSend"
                      onChange={this.updateAmountToSend}
                    />
                    <Label for="amountToSend">Amount</Label>
                    <InputGroupAddon addonType="append">
                      <InputGroupText>DFI</InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                </Col>
                <Col className="col-auto">
                  <Button color="outline-primary">MAX</Button>
                </Col>
              </FormGroup>
              <FormGroup className="form-label-group">
                <InputGroup>
                  <Input type="text" name="toAddress" id="toAddress" placeholder="DFI address" />
                  <Label for="toAddress">To address</Label>
                  <InputGroupAddon addonType="append">
                    <Button color="outline-primary">
                      <MdCropFree />
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
              </FormGroup>
            </Form>
          </section>
        </div>
        <footer className="footer-bar">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <div className="caption-secondary">Amount to send</div>
              <div>{this.state.amountToSend} DFI</div>
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

export default SendPage;