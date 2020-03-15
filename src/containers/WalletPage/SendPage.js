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
import UIfx from 'uifx';
import shutterSound from '../../assets/audio/shutter.mp3'
import QrReader from 'react-qr-reader';
import classnames from 'classnames';

const shutterSnap = new UIfx(shutterSound);

class SendPage extends Component {
  state = {
    walletBalance: 100,
    amountToSend: '',
    amountToSendDisplayed: 0,
    toAddress: '',
    scannerOpen: false,
    flashed: '',
    showBackdrop: '',
    sendStep: 'default',
    waitToSend: 5
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
      shutterSnap.play();
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

  countDownWaitToSend = () => {
    this.waitToSendInterval = setInterval(() => {
      this.setState({
        waitToSend: this.state.waitToSend-1
      });
      if (this.state.waitToSend === 0) {
        clearInterval(this.waitToSendInterval);
      }
    }, 1000);
  }

  handleScanError = err => {
    console.error(err);
  }

  sendStepDefault = () => {
    this.setState({
      sendStep: 'default',
      showBackdrop: '',
      waitToSend: 5
    });
  }

  sendStepConfirm = () => {
    this.countDownWaitToSend();
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
          <Button to="/" tag={NavLink} color="link" className="header-bar-back">
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
                  onLoad={this.prepareSound}
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
          <div className={classnames({ 'd-none': this.state.sendStep !== 'default' })}>
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
          <div className={classnames({ 'd-none': this.state.sendStep !== 'confirm' })}>
            <div className="footer-sheet">
              <dl className="row">
                <dt className="col-sm-3 text-right">Amount</dt>
                <dd className="col-sm-9">
                  <span className="h2 mb-0">{this.state.amountToSend} DFI</span>
                </dd>
                <dt className="col-sm-3 text-right">To</dt>
                <dd className="col-sm-9">{this.state.toAddress}</dd>
              </dl>
            </div>
            <Row className="justify-content-between align-items-center">
              <Col className="col">
                Please verify the amount and recipient.
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
                  disabled={
                    this.state.waitToSend > 0 ? true : false
                  }
                >
                  Complete Send <span className="timer">{this.state.waitToSend > 0 ? this.state.waitToSend : ''}</span>
                </Button>
              </Col>
            </Row>
          </div>
          <div className={classnames({ 'd-none': this.state.sendStep !== 'success' })}>
            <div className="footer-sheet">
              <div className="text-center">
                <MdCheckCircle className="footer-sheet-icon" />
                <p>The transaction was a success. Your wallet balance will update once the transaction has been confirmed by the DeFi Blockchain.</p>
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-center">
              <Button
                color="primary"
                to="/" tag={NavLink}
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