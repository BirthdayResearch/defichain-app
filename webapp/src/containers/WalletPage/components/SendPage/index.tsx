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
import {
  MdArrowBack,
  MdCropFree,
  MdCheckCircle,
  MdErrorOutline,
} from 'react-icons/md';
import { NavLink } from 'react-router-dom';
import UIfx from 'uifx';
import QrReader from 'react-qr-reader';
import classnames from 'classnames';
import { I18n } from 'react-redux-i18n';
import BigNumber from 'bignumber.js';
import { fetchSendDataRequest } from '../../reducer';
import {
  handleFallbackSendToken,
  handleFetchRegularDFI,
  sendToAddress,
  sendTokensToAddress,
} from '../../service';
import { WALLET_PAGE_PATH, DFI_SYMBOL } from '../../../../constants';
import shutterSound from './../../../../assets/audio/shutter.mp3';
import {
  getErrorMessage,
  remapNodeError,
  getPageTitle,
  getSymbolKey,
  isLessThanDustAmount,
  isValidAddress,
} from '../../../../utils/utility';
import qs from 'querystring';
import styles from '../../WalletPage.module.scss';
import Spinner from '../../../../components/Svg/Spinner';
import Header from '../../../HeaderComponent';
import NumberMask from '../../../../components/NumberMask';
import SendLPWarning from './SendLPWarning';
import ViewOnChain from '../../../../components/ViewOnChain';
import { ErrorMessages, ResponseMessages } from '../../../../constants/common';
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
  errMessage: string;
  regularDFI: BigNumber;
  txHash: string;
  isSendLPConfirmed: boolean;
}

export const getWalletPathAddress = (
  basePath: string,
  tokenSymbol: string,
  tokenHash: string,
  tokenAmount: string,
  tokenAddress: string,
  isLPS: boolean
): string => {
  return `${basePath}?hash=${tokenHash}&amount=${tokenAmount.toString()}&address=${tokenAddress}&isLPS=${isLPS}&symbol=${tokenSymbol}`;
};

//* TODO Convert to React Hooks
class SendPage extends Component<SendPageProps, SendPageState> {
  waitToSendInterval;
  urlParams = new URLSearchParams(this.props.location.search);
  tokenSymbol = this.urlParams.get('symbol');
  tokenHash = this.urlParams.get('hash');
  tokenAmount = this.urlParams.get('amount');
  tokenAddress = this.urlParams.get('address');
  isLPS = this.urlParams.get('isLPS') == 'true';

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
    errMessage: '',
    regularDFI: new BigNumber(0),
    txHash: '',
    isSendLPConfirmed: false,
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
      amount = this.props.sendData.walletBalance;
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

  handleSuccess = (txHash) => {
    this.setState({
      sendStep: 'success',
      showBackdrop: 'show-backdrop',
      txHash,
    });
  };

  handleFailure = (error) => {
    this.setState({
      sendStep: 'failure',
      showBackdrop: 'show-backdrop',
      errMessage: remapNodeError(error.message),
    });
  };

  handleLoading = () => {
    this.setState({
      sendStep: 'loading',
      showBackdrop: '',
    });
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
      errMessage: '',
    });
  };

  handleSendLPConfirm = (e) => {
    const { checked } = e.target;
    this.setState({
      isSendLPConfirmed: checked,
    });
  };

  sendTransaction = async () => {
    this.handleLoading();
    const { isAmountValid, isAddressValid } = this.state;
    const regularDFI = await handleFetchRegularDFI();
    this.setState({
      regularDFI,
    });
    if (isAmountValid && isAddressValid) {
      let amount: BigNumber;
      let txHash;
      if (
        (!this.tokenSymbol || this.tokenSymbol === 'DFI') &&
        !regularDFI.isZero()
      ) {
        // Convert to base unit
        amount = new BigNumber(this.state.amountToSendDisplayed);
        // amount.is
        const feeCheck = amount.gte(this.props.sendData.walletBalance);
        // if amount to send is equal to wallet balance then cut tx fee from amountToSend
        try {
          txHash = await sendToAddress(this.state.toAddress, amount, feeCheck);
          this.handleSuccess(txHash);
        } catch (error) {
          this.handleFailure(error);
        }
      } else {
        try {
          const hash = this.tokenHash || DFI_SYMBOL;
          log.info('*******token send **********');
          amount = new BigNumber(this.state.amountToSendDisplayed);
          log.info({
            amount: this.state.amountToSendDisplayed,
            hash,
            address: this.state.toAddress,
          });
          try {
            txHash = await sendTokensToAddress(
              this.state.toAddress,
              `${amount.toFixed(8)}@${hash}`
            );
            log.info('*******token send **********');
            log.info(`accountToAccount tx hash ${txHash}`);
            log.info('*******token send **********');
            this.handleSuccess(txHash);
          } catch (error) {
            const errorMessage = getErrorMessage(error);
            log.error(errorMessage, 'sendTokensToAddress');
            log.info(`sendTransaction: Will try fallback option`);
            this.handleFallbackSendToken(this.state.toAddress, amount, hash);
          }
        } catch (error) {
          const errorMessage = getErrorMessage(error);
          log.error(`Got error in token send: ${errorMessage}`);
          this.handleFailure(error);
        }
      }
    }
  };

  handleFallbackSendToken = async (
    address: string,
    amount: BigNumber,
    hash: string
  ) => {
    try {
      const txHash = await handleFallbackSendToken(address, amount, hash);
      this.handleSuccess(txHash);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      log.error(errorMessage, 'handleFallbackSendToken');
      this.handleFailure(error);
    }
  };

  isAmountValid = async () => {
    let amount;
    if (!this.tokenSymbol) {
      amount = this.props.sendData.walletBalance;
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
      const amountData = params.amount;
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
    const { tokenSymbol, tokenHash, tokenAmount, tokenAddress, isLPS } = this;
    return (
      <div className='main-wrapper'>
        <Helmet>
          <title>
            {getPageTitle(I18n.t('containers.wallet.sendPage.sendTitle'))}
          </title>
        </Helmet>
        <Header>
          <Button
            to={
              tokenSymbol
                ? getWalletPathAddress(
                    WALLET_PAGE_PATH,
                    tokenSymbol,
                    tokenHash || DFI_SYMBOL,
                    tokenAmount || '',
                    tokenAddress || '',
                    isLPS
                  )
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
            {getSymbolKey(tokenSymbol || '', tokenHash || DFI_SYMBOL) ||
              this.props.unit}
          </h1>
        </Header>
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
                        {getSymbolKey(
                          tokenSymbol || '',
                          tokenHash || DFI_SYMBOL
                        ) || this.props.unit}
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
              <div
                className={`footer-backdrop ${this.state.showBackdrop}`}
                onClick={this.sendStepDefault}
              />
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
          {this.isLPS && (
            <section>
              <SendLPWarning
                isSendLPConfirmed={this.state.isSendLPConfirmed}
                handleChange={this.handleSendLPConfirm}
              />
            </section>
          )}
        </div>
        <div
          className={`footer-backdrop ${this.state.showBackdrop}`}
          onClick={this.sendStepDefault}
        />
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
                  <NumberMask
                    value={
                      (!tokenSymbol
                        ? this.props.sendData.walletBalance.toString()
                        : tokenAmount) ?? DFI_SYMBOL
                    }
                  />
                  &nbsp;
                  {tokenSymbol
                    ? getSymbolKey(tokenSymbol || '', tokenHash || DFI_SYMBOL)
                    : this.props.unit}
                </div>
              </Col>
              <Col className='col-auto'>
                <div className='caption-secondary'>
                  {I18n.t('containers.wallet.sendPage.amountToSend')}
                </div>
                <div>
                  <NumberMask
                    value={this.state.amountToSendDisplayed.toString()}
                  />
                  &nbsp;
                  {getSymbolKey(tokenSymbol || '', tokenHash || DFI_SYMBOL) ||
                    this.props.unit}
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
                    !this.state.isAmountValid ||
                    !this.state.isAddressValid ||
                    (this.isLPS && !this.state.isSendLPConfirmed)
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
                    {getSymbolKey(tokenSymbol || '', tokenHash || DFI_SYMBOL) ||
                      this.props.unit}
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
                <div>
                  <b>{I18n.t('containers.wallet.sendPage.txHash')}</b> : &nbsp;
                  <span>{this.state.txHash}</span>
                </div>
              </div>
            </div>
            <div className='d-flex align-items-center justify-content-center'>
              <ViewOnChain txid={this.state.txHash} />
              <Button
                color='primary'
                to={
                  tokenSymbol
                    ? getWalletPathAddress(
                        WALLET_PAGE_PATH,
                        tokenSymbol,
                        tokenHash || DFI_SYMBOL,
                        tokenAmount || '',
                        tokenAddress || '',
                        isLPS
                      )
                    : WALLET_PAGE_PATH
                }
                tag={NavLink}
              >
                {I18n.t('containers.wallet.sendPage.backToWallet')}
              </Button>
            </div>
          </div>
          <div
            className={classnames({
              'd-none': this.state.sendStep !== 'loading',
            })}
          >
            <div className='footer-sheet'>
              <div className='text-center'>
                <Spinner />
              </div>
            </div>
          </div>
          <div
            className={classnames({
              'd-none': this.state.sendStep !== 'failure',
            })}
          >
            <div className='footer-sheet'>
              <div className='text-center'>
                <MdErrorOutline
                  className={classnames({
                    'footer-sheet-icon': true,
                    [styles[`error-dialog`]]: true,
                  })}
                />
                {!this.state.regularDFI && (
                  <p>
                    {I18n.t('containers.wallet.sendPage.pleaseTransferFunds')}
                  </p>
                )}
                <p>{this.state.errMessage}</p>
              </div>
            </div>
            <div className='d-flex align-items-center justify-content-center'>
              <Button color='primary' onClick={this.sendStepDefault}>
                {I18n.t('containers.wallet.sendPage.backToWallet')}
              </Button>
            </div>
          </div>
        </footer>
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
