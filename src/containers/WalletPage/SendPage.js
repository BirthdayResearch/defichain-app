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
  MdCropFree,
  MdCheckCircle
} from "react-icons/md";
import { NavLink } from 'react-router-dom';
import QrReader from 'react-qr-reader';
import styles from './SendPage.module.scss';

class SendPage extends Component {
  state = {
    walletBalance: 100,
    amountToSend: '',
    amountToSendDisplayed: 0,
    toAddress: '',
    scannerOpen: false,
    flashed: '',
    showBackdrop: '',
    sendStep: 'default'
  };

  updateAmountToSend = (e) => {
    let amountToSend = !isNaN(e.target.value) && e.target.value.length ? e.target.value : ''
    let amountToSendDisplayed = !isNaN(amountToSend) && amountToSend.length ? amountToSend : '0'
    this.setState({
      amountToSend: amountToSend,
      amountToSendDisplayed: amountToSendDisplayed
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
      amountToSend: this.state.walletBalance,
      amountToSendDisplayed: this.state.walletBalance
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

  handleScanError = err => {
    console.error(err)
  }

  sendStepDefault = () => {
    this.setState({
      sendStep: 'default',
      showBackdrop: ''
    });
  }

  sendStepConfirm = () => {
    this.setState({
      sendStep: 'confirm',
      showBackdrop: 'show-backdrop'
    });
  }

  sendTransaction = () => {
    this.setState({
      sendStep: 'success',
      showBackdrop: 'show-backdrop'
    });
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
                  onError={this.handleScanError}
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
          <div className={`footer-bar-step ${this.state.sendStep === 'default' ? 'footer-bar-step-show' : ''}`}>
            <Row className="justify-content-between align-items-center">
              <Col className="col-auto">
                <div className="caption-secondary">Wallet balance</div>
                <div>{this.state.walletBalance} DFI</div>
              </Col>
              <Col className="col-auto">
                <div className="caption-secondary">Amount to send</div>
                <div>
                  {this.state.amountToSendDisplayed} DFI
                </div>
              </Col>
              <Col className="d-flex justify-content-end">
                <Button
                  to="/wallet" tag={NavLink}
                  color="link" className="mr-3"
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  disabled={
                    (!this.state.amountToSend || !this.state.toAddress) ? true : false
                  }
                  onClick={this.sendStepConfirm}> Continue
              </Button>
              </Col>
            </Row>
          </div>
          <div className={`footer-bar-step ${this.state.sendStep === 'confirm' ? 'footer-bar-step-show' : ''}`}>
            <div className="footer-sheet">
              <dl class="row">
                <dt class="col-sm-3 text-right">Amount</dt>
                <dd class="col-sm-9">
                  <span className="h2 mb-0">{this.state.amountToSend} DFI</span>
                </dd>
                <dt class="col-sm-3 text-right">To</dt>
                <dd class="col-sm-9">{this.state.toAddress}</dd>
              </dl>
            </div>
            <Row className="justify-content-between align-items-center">
              <Col className="col-auto">
                Please verify amount and recipient and press SEND.
              </Col>
              <Col className="d-flex justify-content-end">
                <Button
                  color="link" className="mr-3"
                  onClick={this.sendStepDefault}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onClick={this.sendTransaction}
                >
                  Send
                </Button>
              </Col>
            </Row>
          </div>
          <div className={`footer-bar-step ${this.state.sendStep === 'success' ? 'footer-bar-step-show' : ''}`}>
            <div className="footer-sheet">
              <div className="text-center">
                <MdCheckCircle className="footer-sheet-icon" />
                <p>The transaction was a success. Your wallet balance will update once the transaction has been confirmed by the DeFi Blockchain.</p>
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-end">
              <Button
                color="primary"
                to="/wallet" tag={NavLink}
              >
                  Back to wallet
              </Button>
            </div>
          </div>
        </footer>
        <div
          className={`footer-backdrop ${this.state.showBackdrop}`}
          onClick={this.sendStepDefault}
        />
      </div>
    );
  }
}

export default SendPage;