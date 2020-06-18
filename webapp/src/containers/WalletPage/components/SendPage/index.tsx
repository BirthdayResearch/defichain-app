import React, { useState, useEffect } from 'react';
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
import usePrevious from '../../../../components/UsePrevious';
const shutterSnap = new UIfx(shutterSound);

interface SendPageProps {
  unit: string;
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
}
const initalState = {
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
};

const SendPage: React.FunctionComponent<SendPageProps> = (
  props: SendPageProps
) => {
  const { fetchSendDataRequest, sendData, unit } = props;
  const [state, setState] = useState<SendPageState>(initalState);
  const prevState: any = usePrevious(state);
  let waitToSendInterval;

  useEffect(() => {
    fetchSendDataRequest();
    return () => {
      clearInterval(waitToSendInterval);
    };
  }, []);

  useEffect(() => {
    if (
      !!prevState &&
      (prevState.amountToSend !== state.amountToSend ||
        prevState.amountToSendDisplayed !== state.amountToSendDisplayed)
    ) {
      isAmountValid();
    }
  }, [state, prevState]);

  const setSendPageState = (updatedObj: any) => {
    const updatedState = Object.assign({}, state, updatedObj);
    setState(updatedState);
  };

  const updateAmountToSend = e => {
    const { value } = e.target;
    if (isNaN(value) && value.length) return false;

    const amountToSend =
      !isNaN(e.target.value) && e.target.value.length ? e.target.value : '';
    const amountToSendDisplayed =
      !isNaN(amountToSend) && amountToSend.length ? amountToSend : '0';
    setSendPageState({ amountToSend, amountToSendDisplayed });
  };

  const updateToAddress = e => {
    const toAddress = e.target.value;
    setSendPageState({
      toAddress,
    });
  };

  const maxAmountToSend = () => {
    const amount = getAmountInSelectedUnit(sendData.walletBalance, unit);
    setSendPageState({
      amountToSend: amount,
      amountToSendDisplayed: amount,
    });
  };

  const openScanner = () => {
    setSendPageState({
      scannerOpen: true,
    });
  };

  const toggleScanner = () => {
    setSendPageState({
      scannerOpen: !state.scannerOpen,
    });
  };

  const handleScan = data => {
    if (data) {
      shutterSnap.play();
      setSendPageState({
        toAddress: data,
        flashed: 'flashed',
      });
      setTimeout(() => {
        isAddressValid();
        toggleScanner();
        setSendPageState({
          flashed: '',
        });
      }, 600);
    }
  };

  const countDownWaitToSend = () => {
    waitToSendInterval = setInterval(() => {
      setSendPageState({
        waitToSend: state.waitToSend - 1,
      });
      if (state.waitToSend === 0) {
        clearInterval(waitToSendInterval);
      }
    }, 1000);
  };

  const handleScanError = err => {
    log.error(err);
  };

  const sendStepDefault = () => {
    setSendPageState({
      sendStep: 'default',
      showBackdrop: '',
      waitToSend: 5,
    });
    clearInterval(waitToSendInterval);
  };

  const sendStepConfirm = () => {
    countDownWaitToSend();
    setSendPageState({
      sendStep: 'confirm',
      showBackdrop: 'show-backdrop',
    });
  };

  const sendTransaction = async () => {
    const { isAmountValid, isAddressValid } = state;
    if (isAmountValid && isAddressValid) {
      // Convert to base unit
      const amount = getAmountInSelectedUnit(
        state.amountToSendDisplayed,
        DEFAULT_UNIT,
        unit
      );
      // if amount to send is equal to wallet balance then cut tx fee from amountToSend
      if (new BigNumber(amount).eq(sendData.walletBalance))
        await sendToAddress(state.toAddress, amount, true);
      else await sendToAddress(state.toAddress, amount, false);
      setSendPageState({
        sendStep: 'success',
        showBackdrop: 'show-backdrop',
      });
    }
  };

  const isAmountValid = async () => {
    const amount = getAmountInSelectedUnit(sendData.walletBalance, unit);

    const isLessThanBalance = new BigNumber(state.amountToSendDisplayed).lte(
      amount
    );

    const isAmountValid =
      state.amountToSend &&
      state.amountToSendDisplayed > 0 &&
      isLessThanBalance &&
      !isLessThanDustAmount(state.amountToSendDisplayed, unit);
    setSendPageState({ isAmountValid });
  };

  const isAddressValid = async () => {
    const isAddressValid = await isValidAddress(state.toAddress);
    setSendPageState({ isAddressValid });
  };
  return (
    <div className='main-wrapper'>
      <Helmet>
        <title>{I18n.t('containers.wallet.sendPage.sendDFITitle')}</title>
      </Helmet>
      <header className='header-bar'>
        <Button
          to={WALLET_PAGE_PATH}
          tag={NavLink}
          color='link'
          className='header-bar-back'
        >
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
                  {/* TODO: show inline error for failed vaildation */}
                  <Input
                    type='text'
                    inputMode='numeric'
                    placeholder={I18n.t(
                      'containers.wallet.sendPage.amountToSend'
                    )}
                    name='amountToSend'
                    id='amountToSend'
                    value={state.amountToSend}
                    onChange={updateAmountToSend}
                    autoFocus
                  />
                  <Label for='amountToSend'>
                    {I18n.t('containers.wallet.sendPage.amount')}
                  </Label>
                  <InputGroupAddon addonType='append'>
                    <InputGroupText>{unit}</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </Col>
              <Col className='col-auto'>
                <Button color='outline-primary' onClick={maxAmountToSend}>
                  {I18n.t('containers.wallet.sendPage.MAX')}
                </Button>
              </Col>
            </FormGroup>
            <FormGroup className='form-label-group'>
              <InputGroup>
                <Input
                  type='text'
                  placeholder={I18n.t('containers.wallet.sendPage.dfiAddress')}
                  name='toAddress'
                  id='toAddress'
                  value={state.toAddress}
                  onChange={updateToAddress}
                  onBlur={isAddressValid}
                />
                <Label for='toAddress'>
                  {I18n.t('containers.wallet.sendPage.toAddress')}
                </Label>
                <InputGroupAddon addonType='append'>
                  <Button color='outline-primary' onClick={openScanner}>
                    <MdCropFree />
                  </Button>
                </InputGroupAddon>
              </InputGroup>
            </FormGroup>
          </Form>
          <Modal
            isOpen={state.scannerOpen}
            toggle={toggleScanner}
            centered={true}
            className={`qr-scanner ${state.flashed}`}
          >
            <ModalBody>
              <QrReader
                delay={1000}
                onError={handleScanError}
                onScan={handleScan}
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
            'd-none': state.sendStep !== 'default',
          })}
        >
          <Row className='justify-content-between align-items-center'>
            <Col className='col-auto'>
              <div className='caption-secondary'>
                {I18n.t('containers.wallet.sendPage.walletBalance')}
              </div>
              <div>
                {getAmountInSelectedUnit(sendData.walletBalance, unit)}
                &nbsp;
                {unit}
              </div>
            </Col>
            <Col className='col-auto'>
              <div className='caption-secondary'>
                {I18n.t('containers.wallet.sendPage.amountToSend')}
              </div>
              <div>
                {state.amountToSendDisplayed}&nbsp;
                {unit}
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
                disabled={!state.isAmountValid || !state.isAddressValid}
                onClick={sendStepConfirm}
              >
                {I18n.t('containers.wallet.sendPage.continue')}
              </Button>
            </Col>
          </Row>
        </div>
        <div
          className={classnames({
            'd-none': state.sendStep !== 'confirm',
          })}
        >
          <div className='footer-sheet'>
            <dl className='row'>
              <dt className='col-sm-3 text-right'>
                {I18n.t('containers.wallet.sendPage.amount')}
              </dt>
              <dd className='col-sm-9'>
                <span className='h2 mb-0'>
                  {state.amountToSend}&nbsp;
                  {unit}
                </span>
              </dd>
              <dt className='col-sm-3 text-right'>
                {I18n.t('containers.wallet.sendPage.to')}
              </dt>
              <dd className='col-sm-9'>{state.toAddress}</dd>
            </dl>
          </div>
          <Row className='justify-content-between align-items-center'>
            <Col className='col'>
              {I18n.t('containers.wallet.sendPage.pleaseVerifyAmount')}
            </Col>
            <Col className='d-flex justify-content-end'>
              <Button color='link' className='mr-3' onClick={sendStepDefault}>
                {I18n.t('containers.wallet.sendPage.cancel')}
              </Button>
              <Button
                color='primary'
                onClick={sendTransaction}
                disabled={state.waitToSend > 0 ? true : false}
              >
                {I18n.t('containers.wallet.sendPage.completeSend')}&nbsp;
                <span className='timer'>
                  {state.waitToSend > 0 ? state.waitToSend : ''}
                </span>
              </Button>
            </Col>
          </Row>
        </div>
        <div
          className={classnames({
            'd-none': state.sendStep !== 'success',
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
        className={`footer-backdrop ${state.showBackdrop}`}
        onClick={sendStepDefault}
      />
    </div>
  );
};

const mapStateToProps = state => {
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
