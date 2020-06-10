import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import uid from 'uid';
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from 'reactstrap';
import { MdArrowBack } from 'react-icons/md';
import { NavLink } from 'react-router-dom';
import { I18n } from 'react-redux-i18n';
import * as log from '../../../../utils/electronLogger';
import { addReceiveTxnsRequest } from '../../reducer';
import {
  WALLET_PAGE_PATH,
  WALLET_PAYMENT_REQ_BASE_PATH,
  DEFAULT_UNIT,
} from '../../../../constants';
import { getNewAddress } from '../../service';
import {
  getAmountInSelectedUnit,
  isLessThanDustAmount,
} from '../../../../utils/utility';

interface ReceivePageProps {
  history: {
    push(url: string): void;
  };
  unit: string;
  paymentRequests: [];
  addReceiveTxns: (...args: any[]) => void;
}

interface ReceivePageState {
  amount: number | string;
  label: string;
  message: string;
  address: string | undefined;
}

class ReceivePage extends Component<ReceivePageProps, ReceivePageState> {
  state = {
    amount: '',
    label: '',
    message: '',
    address: '',
  };

  onSubmit = async () => {
    try {
      const { amount, label, message } = this.state;
      const newAddress = await getNewAddress(label);
      if (!newAddress) {
        throw new Error(
          I18n.t('containers.wallet.receivePage.addressNotAvailable')
        );
      }

      const data = {
        label,
        message,
        id: uid(),
        time: new Date().toString(),
        unit: DEFAULT_UNIT,
        address: newAddress,
        amount: amount
          ? getAmountInSelectedUnit(amount, DEFAULT_UNIT, this.props.unit)
          : null,
      };
      this.props.addReceiveTxns(data);
      this.props.history.push(`${WALLET_PAYMENT_REQ_BASE_PATH}/${data.id}`);
    } catch (err) {
      log.error(err);
    }
  };

  handleChange = event => {
    const { name, value, inputMode } = event.target;
    if (inputMode === 'numeric' && isNaN(value) && value !== '') {
      return false;
    }
    const newState = { [name]: value } as Pick<
      ReceivePageState,
      keyof ReceivePageState
    >;
    this.setState(newState);
  };

  isValidAmount = () => {
    const { amount } = this.state;
    return amount === ''
      ? true
      : !isLessThanDustAmount(amount, this.props.unit);
  };

  render() {
    const { amount, label, message } = this.state;
    return (
      <div className='main-wrapper'>
        <Helmet>
          <title>
            {I18n.t('containers.wallet.receivePage.receiveDFITitle')}
          </title>
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
              {I18n.t('containers.wallet.receivePage.wallet')}
            </span>
          </Button>
          <h1>{I18n.t('containers.wallet.receivePage.receiveDFI')}</h1>
        </header>
        <div className='content'>
          <section>
            <Form>
              <FormGroup className='form-label-group'>
                <InputGroup>
                  {/* TODO: show inline error for failed vaildation */}
                  <Input
                    type='text'
                    inputMode='numeric'
                    placeholder={I18n.t(
                      'containers.wallet.receivePage.amountToReceive'
                    )}
                    value={amount}
                    name='amount'
                    id='amount'
                    onChange={this.handleChange}
                    autoFocus
                  />
                  <Label for='amount'>
                    {I18n.t('containers.wallet.receivePage.amount')}
                  </Label>
                  <InputGroupAddon addonType='append'>
                    <InputGroupText>{this.props.unit}</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </FormGroup>
              <FormGroup className='form-label-group'>
                <Input
                  type='text'
                  value={label}
                  name='label'
                  id='label'
                  onChange={this.handleChange}
                  placeholder={I18n.t('containers.wallet.receivePage.label')}
                />
                <Label for='message'>
                  {I18n.t('containers.wallet.receivePage.label')}
                </Label>
              </FormGroup>
              <FormGroup className='form-label-group'>
                <Input
                  value={message}
                  type='textarea'
                  name='message'
                  id='message'
                  onChange={this.handleChange}
                  placeholder={I18n.t('containers.wallet.receivePage.message')}
                  rows='3'
                />
                <Label for='message'>
                  {I18n.t('containers.wallet.receivePage.message')}
                </Label>
              </FormGroup>
            </Form>
          </section>
        </div>
        <footer className='footer-bar'>
          <div className='d-flex justify-content-between align-items-center'>
            <div>
              <div className='caption-secondary'>
                {I18n.t('containers.wallet.receivePage.amountToReceive')}
              </div>
              <div>
                {amount || '-'}&nbsp;
                {this.props.unit}
              </div>
            </div>
            <div>
              <Button
                to={WALLET_PAGE_PATH}
                tag={NavLink}
                color='link'
                className='mr-3'
              >
                {I18n.t('containers.wallet.receivePage.cancel')}
              </Button>
              <Button
                color='primary'
                onClick={this.onSubmit}
                disabled={!this.isValidAmount()}
              >
                {I18n.t('containers.wallet.receivePage.continue')}
              </Button>
            </div>
          </div>
        </footer>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { wallet, settings } = state;
  return {
    paymentRequests: wallet.paymentRequests,
    unit: settings.appConfig.unit,
  };
};

const mapDispatchToProps = {
  addReceiveTxns: (data: any) => addReceiveTxnsRequest(data),
};

export default connect(mapStateToProps, mapDispatchToProps)(ReceivePage);
