import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import * as log from '../../../../utils/electronLogger';
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
import BigNumber from 'bignumber.js';
import { fetchSendDataRequest } from '../../reducer';
import { isValidAddress, sendToAddress } from '../../service';
import { WALLET_PAGE_PATH, DEFAULT_UNIT } from '../../../../constants';
import shutterSound from './../../../../assets/audio/shutter.mp3';
import {
  getAmountInSelectedUnit,
  isLessThanDustAmount,
} from '../../../../utils/utility';
import qs from 'querystring';
const shutterSnap = new UIfx(shutterSound);

interface SendPageProps {
  unit: string;
  location?: any;
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
  fetchSendDataRequest: () => void;
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
  isAmountValid: boolean | string;
  isAddressValid: boolean | string;
  uriData: string;
}

class SendPage extends Component<SendPageProps, SendPageState> {
  waitToSendInterval;
  urlParams = new URLSearchParams(this.props.location.search);
  tokenSymbol = this.urlParams.get('symbol');
  tokenHash = this.urlParams.get('hash');
  tokenAmount = this.urlParams.get('amount');

  state = {
    walletBalance: 0,
    amountToSend: '',
    amountToSendDisplayed: 0,
    toAddress: '',
    scannerOpen: false,
    flashed: '',
    showBackdrop: '',
    sendStep: 'default',
    waitToSend: 5,
    isAmountValid: false,
    isAddressValid: false,
    uriData: '',
  };

  componentDidMount() {
    this.props.fetchSendDataRequest();
  }

  updateAmountToSend = (e) => {
    const { value } = e.target;
    if (isNaN(value) && value.length) return false;

    const amountToSend = !isNaN(value) && value.length ? value : '';
    const amountToSendDisplayed =
      !isNaN(amountToSend) && amountToSend.length ? amountToSend : '0';
    this.setState({ amountToSend, amountToSendDisplayed }, () => {
      this.isAmountValid();
    });
  };

  updateToAddress = (e) => {
    const toAddress = e.target.value;
    this.setState(
      {
        toAddress,
      },
      this.isAddressValid
    );
  };

  maxAmountToSend = () => {
    let amount;
    if (!this.tokenSymbol) {
      amount = getAmountInSelectedUnit(
        this.props.sendData.walletBalance,
        this.props.unit
      );
    } else {
      amount = this.tokenAmount;
    }
    this.setState(
      {
        amountToSend: amount,
        amountToSendDisplayed: amount,
      },
      () => {
        this.isAmountValid();
      }
    );
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

  handleScan = (data) => {
    const updatedState = {
      flashed: 'flashed',
      toAddress: '',
      uriData: '',
    };
    if (data) {
      if (data.includes('DFI')) {
        updatedState.uriData = data;
      } else {
        updatedState.toAddress = data;
      }
      shutterSnap.play();
      this.setState(updatedState);
      setTimeout(() => {
        this.isQRCodeValid();
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

  handleScanError = (err) => {
    log.error(err);
  };

  sendStepDefault = () => {
    this.setState({
      sendStep: 'default',
      showBackdrop: '',
      waitToSend: 5,
    });
    clearInterval(this.waitToSendInterval);
  };

  sendStepConfirm = () => {
    this.countDownWaitToSend();
    this.setState({
      sendStep: 'confirm',
      showBackdrop: 'show-backdrop',
    });
  };

  sendTransaction = async () => {
    const { isAmountValid, isAddressValid } = this.state;
    if (isAmountValid && isAddressValid) {
      // Convert to base unit
      const amount = getAmountInSelectedUnit(
        this.state.amountToSendDisplayed,
        DEFAULT_UNIT,
        this.props.unit
      );
      // if amount to send is equal to wallet balance then cut tx fee from amountToSend
      if (new BigNumber(amount).eq(this.props.sendData.walletBalance))
        await sendToAddress(this.state.toAddress, amount, true);
      else await sendToAddress(this.state.toAddress, amount, false);
      this.setState({
        sendStep: 'success',
        showBackdrop: 'show-backdrop',
      });
    }
  };

  isAmountValid = async () => {
    let amount;
    if (!this.tokenSymbol) {
      amount = getAmountInSelectedUnit(
        this.props.sendData.walletBalance,
        this.props.unit
      );
    } else {
      amount = this.tokenAmount;
    }

    const isLessThanBalance = new BigNumber(
      this.state.amountToSendDisplayed
    ).lte(amount);

    const isAmountValid =
      this.state.amountToSend &&
      this.state.amountToSendDisplayed > 0 &&
      isLessThanBalance &&
      !isLessThanDustAmount(this.state.amountToSendDisplayed, this.props.unit);
    this.setState({ isAmountValid });
  };

  isQRCodeValid = async () => {
    const { uriData } = this.state;
    if (!!uriData) {
      const start = uriData.indexOf(':');
      const end = uriData.indexOf('?');
      const toAddress = uriData.substring(start + 1, end);
      const queryData = uriData.substring(end + 1);
      const params = qs.parse(queryData);
      const amountData = getAmountInSelectedUnit(
        params.amount as string,
        this.props.unit
      );
      this.updateAmountToSend({ target: { value: amountData } });
      this.setState({
        toAddress,
        uriData: '',
      });
    }
    this.isAddressValid();
  };

  isAddressValid = async () => {
    let isAddressValid = false;
    if (
      this.state.toAddress.length >= 26 && // address, is an identifier of 26-35 alphanumeric characters
      this.state.toAddress.length <= 35
    ) {
      isAddressValid = await isValidAddress(this.state.toAddress);
    }
    this.setState({ isAddressValid });
  };

  render() {
    const { tokenSymbol, tokenHash, tokenAmount } = this;
    return (
      <div className='main-wrapper'>
        <Helmet>
          <title>{I18n.t('containers.wallet.sendPage.sendTitle')}</title>
        </Helmet>
        <header className='header-bar'>
          <Button
            to={
              tokenSymbol
                ? `${WALLET_PAGE_PATH}?symbol=${tokenSymbol}&hash=${tokenHash}&amount=${tokenAmount}`
                : WALLET_PAGE_PATH
            }
            tag={NavLink}
            color='link'
            className='header-bar-back'
          >
            <MdArrowBack />
            <span className='d-lg-inline'>
              {I18n.t('containers.wallet.sendPage.wallet')}
            </span>
          </Button>
          <h1>
            {I18n.t('containers.wallet.sendPage.send')}{' '}
            {tokenSymbol ? tokenSymbol : this.props.unit}
          </h1>
        </header>
        <div className='content'>
          <section>
            <Form>
              <FormGroup className='form-label-group form-row'>
                <Col>
                  <InputGroup>
                    {/* TODO: show inline error for failed vaildation */}
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
                        {tokenSymbol ? tokenSymbol : this.props.unit}
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
                  onError={this.handleScanError}
                  onScan={this.handleScan}
                  showViewFinder={false}
                  className='qr-scanner-preview w-100'
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
                  {!tokenSymbol
                    ? getAmountInSelectedUnit(
                        this.props.sendData.walletBalance,
                        this.props.unit
                      )
                    : tokenAmount}
                  &nbsp;
                  {tokenSymbol ? tokenSymbol : this.props.unit}
                </div>
              </Col>
              <Col className='col-auto'>
                <div className='caption-secondary'>
                  {I18n.t('containers.wallet.sendPage.amountToSend')}
                </div>
                <div>
                  {this.state.amountToSendDisplayed}&nbsp;
                  {tokenSymbol ? tokenSymbol : this.props.unit}
                </div>
              </Col>
              <Col className='d-flex justify-content-end'>
                <Button
                  to={WALLET_PAGE_PATH}
                  tag={NavLink}
                  color='link'
                  className='mr-3'
                >
                  {I18n.t('containers.wallet.sendPage.cancel')}
                </Button>
                <Button
                  color='primary'
                  disabled={
                    !this.state.isAmountValid || !this.state.isAddressValid
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
                    {tokenSymbol ? tokenSymbol : this.props.unit}
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
              <Button color='primary' to={WALLET_PAGE_PATH} tag={NavLink}>
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

const mapStateToProps = (state) => {
  const { wallet, settings } = state;
  return {
    unit: settings.appConfig.unit,
    sendData: wallet.sendData,
  };
};

const mapDispatchToProps = {
  fetchSendDataRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(SendPage);
