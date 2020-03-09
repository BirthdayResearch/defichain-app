import React, { Component } from 'react';
import { Helmet } from "react-helmet";
import {
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Modal,
  ModalBody
} from 'reactstrap';
import {
  MdArrowBack,
  MdCropFree
} from "react-icons/md";
import { NavLink } from 'react-router-dom';
import QrReader from 'react-qr-reader'

class SendPage extends Component {
  state = {
    walletBalance: 100,
    amountToSend: '',
    toAddress: '',
    scannerOpen: false,
    flashed: ''
  };

  updateAmountToSend = (e) => {
    let amountToSend = e.target.value;
    this.setState({
      amountToSend: amountToSend
    });
  }

  updateToAddress = (e) => {
    let toAddress = e.target.value;
    this.setState({
      toAddress: toAddress
    });
  }

  maxAmountToSend = () => {
    this.setState({
      amountToSend: this.state.walletBalance
    });
  }

  openScanner = () => {
    this.setState({
      scannerOpen: true
    });
  }

  toggleScanner = () => {
    this.setState({
      scannerOpen: !this.state.scannerOpen
    });
  }

  handleScan = data => {
    if (data) {
      this.setState({
        toAddress: data,
        flashed: 'flashed'
      });
      setTimeout(() => {
        this.toggleScanner();
        this.setState({
          flashed: ''
        });
      }, 600);
    }
  }

  handleError = err => {
    console.error(err)
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
                      value={this.state.amountToSend}
                      onChange={this.updateAmountToSend}
                      autoFocus
                    />
                    <Label for="amountToSend">Amount</Label>
                    <InputGroupAddon addonType="append">
                      <InputGroupText>DFI</InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                </Col>
                <Col className="col-auto">
                  <Button
                    color="outline-primary"
                    onClick={this.maxAmountToSend}
                  >MAX</Button>
                </Col>
              </FormGroup>
              <FormGroup className="form-label-group">
                <InputGroup>
                  <Input
                    type="text" placeholder="DFI address"
                    name="toAddress" id="toAddress"
                    value={this.state.toAddress}
                    onChange={this.updateToAddress}
                  />
                  <Label for="toAddress">To address</Label>
                  <InputGroupAddon addonType="append">
                    <Button
                      color="outline-primary"
                      onClick={this.openScanner}
                    >
                      <MdCropFree />
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
              </FormGroup>
            </Form>
            <Modal
              isOpen={this.state.scannerOpen}
              toggle={this.toggleScanner}
              centered={true}
              className={`qr-scanner ${this.state.flashed}`}
            >
              <ModalBody>
                <QrReader
                  delay={1000}
                  onError={this.handleError}
                  onScan={this.handleScan}
                  showViewFinder={false}
                  style={{ width: '100%' }}
                  className="qr-scanner-preview"
                />
              </ModalBody>
            </Modal>
          </section>
        </div>
        <footer className="footer-bar">
          <Row className="justify-content-between align-items-center">
            <Col className="col-auto">
              <div className="caption-secondary">Wallet balance</div>
              <div>{this.state.walletBalance} DFI</div>
            </Col>
            <Col className="col-auto">
              <div className="caption-secondary">Amount to send</div>
              <div>
                {!isNaN(this.state.amountToSend) && this.state.amountToSend.length ? this.state.amountToSend : '0'} DFI
              </div>
            </Col>
            <Col className="d-flex justify-content-end">
              <Button to="/wallet" tag={NavLink} color="link" className="mr-3">Cancel</Button>
              <Button
                color="primary"
                disabled={
                  (!this.state.amountToSend.length || !this.state.toAddress.length) ? true : false
                }> Continue
              </Button>
            </Col>
          </Row>
        </footer>
      </div>
    );
  }
}

export default SendPage;