import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
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
  ModalBody,
} from 'reactstrap';
import { MdArrowBack, MdCropFree, MdCheckCircle } from 'react-icons/md';
import { NavLink } from 'react-router-dom';
import UIfx from 'uifx';
import QrReader from 'react-qr-reader';
import classnames from 'classnames';
import { I18n } from 'react-redux-i18n';
import log from 'loglevel';
import shutterSound from './../../../../assets/audio/shutter.mp3';

const shutterSnap = new UIfx(shutterSound);
import { fetchSendDataRequest } from '../../reducer';

interface SendPageProps {
  sendData: {
    walletBalance: number;
    amountToSend: string | number;
    amountToSendDisplayed: number | string;
    toAddress: string;
    scannerOpen: boolean;
    flashed: string;
    showBackdrop: string;
    sendStep: string;
    waitToSend: number;
  };
  fetchSendData: () => void;
}

interface SendPageState {
  walletBalance: number;
  amountToSend: string | number;
  amountToSendDisplayed: number | string;
  toAddress: string;
  scannerOpen: boolean;
  flashed: string;
  showBackdrop: string;
  sendStep: string;
  waitToSend: number;
}

class SendPage extends Component<SendPageProps, SendPageState> {
  waitToSendInterval;

  state = {
    walletBalance: 100,
    amountToSend: '',
    amountToSendDisplayed: 0,
    toAddress: '',
    scannerOpen: false,
    flashed: '',
    showBackdrop: '',
    sendStep: 'default',
    waitToSend: 5,
  };
  componentDidMount() {
    this.props.fetchSendData();
  }
  updateAmountToSend = e => {
    const amountToSend =
      !isNaN(e.target.value) && e.target.value.length ? e.target.value : '';
    const amountToSendDisplayed =
      !isNaN(amountToSend) && amountToSend.length ? amountToSend : '0';
    this.setState({
      amountToSend,
      amountToSendDisplayed,
    });
  };

  updateToAddress = e => {
    const toAddress = e.target.value;
    this.setState({
      toAddress,
    });
  };

  maxAmountToSend = () => {
    this.setState({
      amountToSend: this.state.walletBalance,
      amountToSendDisplayed: this.state.walletBalance,
    });
  };

  openScanner = () => {
    this.setState({
      scannerOpen: true,
    });
  };

  toggleScanner = () => {
    this.setState({
      scannerOpen: !this.state.scannerOpen,
    });
  };

  handleScan = data => {
    if (data) {
      shutterSnap.play();
      this.setState({
        toAddress: data,
        flashed: 'flashed',
      });
      setTimeout(() => {
        this.toggleScanner();
        this.setState({
          flashed: '',
        });
      }, 600);
    }
  };

  countDownWaitToSend = () => {
    this.waitToSendInterval = setInterval(() => {
      this.setState({
        waitToSend: this.state.waitToSend - 1,
      });
      if (this.state.waitToSend === 0) {
        clearInterval(this.waitToSendInterval);
      }
    }, 1000);
  };

  handleScanError = err => {
    log.error(err);
  };

  sendStepDefault = () => {
    this.setState({
      sendStep: 'default',
      showBackdrop: '',
      waitToSend: 5,
    });
  };

  sendStepConfirm = () => {
    this.countDownWaitToSend();
    this.setState({
      sendStep: 'confirm',
      showBackdrop: 'show-backdrop',
    });
  };

  sendTransaction = () => {
    this.setState({
      sendStep: 'success',
      showBackdrop: 'show-backdrop',
    });
  };

  prepareSound = () => {};
  render() {
    return (
      <div className='main-wrapper'>
        <Helmet>
          <title>{I18n.t('containers.wallet.sendPage.sendDFITitle')}</title>
        </Helmet>
        <header className='header-bar'>
          <Button to='/' tag={NavLink} color='link' className='header-bar-back'>
            <MdArrowBack />
            <span className='d-lg-inline'>
              {I18n.t('containers.wallet.sendPage.wallet')}
            </span>
          </Button>
          <h1>{I18n.t('containers.wallet.sendPage.sendDFI')}</h1>
        </header>
        <div className='content'>
          <section>
            <Form>
              <FormGroup className='form-label-group form-row'>
                <Col>
                  <InputGroup>
                    <Input
                      type='text'
                      inputMode='numeric'
                      placeholder={I18n.t(
                        'containers.wallet.sendPage.amountToSend'
                      )}
                      name='amountToSend'
                      id='amountToSend'
                      value={this.state.amountToSend}
                      onChange={this.updateAmountToSend}
                      autoFocus
                    />
                    <Label for='amountToSend'>
                      {I18n.t('containers.wallet.sendPage.amount')}
                    </Label>
                    <InputGroupAddon addonType='append'>
                      <InputGroupText>
                        {I18n.t('containers.wallet.sendPage.dFI')}
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                </Col>
                <Col className='col-auto'>
                  <Button
                    color='outline-primary'
                    onClick={this.maxAmountToSend}
                  >
                    {I18n.t('containers.wallet.sendPage.MAX')}
                  </Button>
                </Col>
              </FormGroup>
              <FormGroup className='form-label-group'>
                <InputGroup>
                  <Input
                    type='text'
                    placeholder={I18n.t(
                      'containers.wallet.sendPage.dfiAddress'
                    )}
                    name='toAddress'
                    id='toAddress'
                    value={this.state.toAddress}
                    onChange={this.updateToAddress}
                  />
                  <Label for='toAddress'>
                    {I18n.t('containers.wallet.sendPage.toAddress')}
                  </Label>
                  <InputGroupAddon addonType='append'>
                    <Button color='outline-primary' onClick={this.openScanner}>
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
                  className='qr-scanner-preview'
                />
              </ModalBody>
            </Modal>
          </section>
        </div>
        <footer className='footer-bar'>
          <div
            className={classnames({
              'd-none': this.state.sendStep !== 'default',
            })}
          >
            <Row className='justify-content-between align-items-center'>
              <Col className='col-auto'>
                <div className='caption-secondary'>
                  {I18n.t('containers.wallet.sendPage.walletBalance')}
                </div>
                <div>
                  {this.state.walletBalance}&nbsp;
                  {I18n.t('containers.wallet.sendPage.dFI')}
                </div>
              </Col>
              <Col className='col-auto'>
                <div className='caption-secondary'>
                  {I18n.t('containers.wallet.sendPage.amountToSend')}
                </div>
                <div>
                  {this.state.amountToSendDisplayed}&nbsp;
                  {I18n.t('containers.wallet.sendPage.dFI')}
                </div>
              </Col>
              <Col className='d-flex justify-content-end'>
                <Button to='/' tag={NavLink} color='link' className='mr-3'>
                  {I18n.t('containers.wallet.sendPage.cancel')}
                </Button>
                <Button
                  color='primary'
                  disabled={
                    !this.state.amountToSend || !this.state.toAddress
                      ? true
                      : false
                  }
                  onClick={this.sendStepConfirm}
                >
                  {I18n.t('containers.wallet.sendPage.continue')}
                </Button>
              </Col>
            </Row>
          </div>
          <div
            className={classnames({
              'd-none': this.state.sendStep !== 'confirm',
            })}
          >
            <div className='footer-sheet'>
              <dl className='row'>
                <dt className='col-sm-3 text-right'>
                  {I18n.t('containers.wallet.sendPage.amount')}
                </dt>
                <dd className='col-sm-9'>
                  <span className='h2 mb-0'>
                    {this.state.amountToSend}&nbsp;
                    {I18n.t('containers.wallet.sendPage.dFI')}
                  </span>
                </dd>
                <dt className='col-sm-3 text-right'>
                  {I18n.t('containers.wallet.sendPage.to')}
                </dt>
                <dd className='col-sm-9'>{this.state.toAddress}</dd>
              </dl>
            </div>
            <Row className='justify-content-between align-items-center'>
              <Col className='col'>
                {I18n.t('containers.wallet.sendPage.pleaseVerifyAmount')}
              </Col>
              <Col className='d-flex justify-content-end'>
                <Button
                  color='link'
                  className='mr-3'
                  onClick={this.sendStepDefault}
                >
                  {I18n.t('containers.wallet.sendPage.cancel')}
                </Button>
                <Button
                  color='primary'
                  onClick={this.sendTransaction}
                  disabled={this.state.waitToSend > 0 ? true : false}
                >
                  {I18n.t('containers.wallet.sendPage.completeSend')}&nbsp;
                  <span className='timer'>
                    {this.state.waitToSend > 0 ? this.state.waitToSend : ''}
                  </span>
                </Button>
              </Col>
            </Row>
          </div>
          <div
            className={classnames({
              'd-none': this.state.sendStep !== 'success',
            })}
          >
            <div className='footer-sheet'>
              <div className='text-center'>
                <MdCheckCircle className='footer-sheet-icon' />
                <p>
                  {I18n.t('containers.wallet.sendPage.transactionSuccessMsg')}
                </p>
              </div>
            </div>
            <div className='d-flex align-items-center justify-content-center'>
              <Button color='primary' to='/' tag={NavLink}>
                {I18n.t('containers.wallet.sendPage.backToWallet')}
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

const mapStateToProps = state => {
  const { sendData } = state.wallet;
  return {
    sendData,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchSendData: () => dispatch(fetchSendDataRequest()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SendPage);
