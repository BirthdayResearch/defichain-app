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
import log from 'loglevel';
import { addReceiveTxnsRequest } from '../../reducer';
import {
  WALLET_PAGE_PATH,
  DEFAULT_UNIT,
  WALLET_PAYMENT_REQ_BASE_PATH,
} from '../../../../constants';
import { isValidNumber } from '../../../../utils/validation';
import { getNewAddress } from '../../service';

interface ReceivePageProps {
  history: {
    push(url: string): void;
  };
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
        amount,
        label,
        message,
        id: uid(),
        time: new Date().toString(),
        unit: DEFAULT_UNIT,
        address: newAddress,
      };
      this.props.addReceiveTxns(data);
      this.props.history.push(`${WALLET_PAYMENT_REQ_BASE_PATH}/${data.id}`);
    } catch (err) {
      log.error(err);
    }
  };

  handelChange = event => {
    const { name, value, type } = event.target;
    if (type === 'number' && !isValidNumber(value) && value !== '') {
      return false;
    }
    const newState = { [name]: value } as Pick<
      ReceivePageState,
      keyof ReceivePageState
    >;
    this.setState(newState);
  };

  render() {
    const { amount, label, message, address } = this.state;
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
                  <Input
                    type='number'
                    pattern='[0-9]*'
                    inputMode='numeric'
                    placeholder={I18n.t(
                      'containers.wallet.receivePage.amountToReceive'
                    )}
                    value={amount}
                    name='amount'
                    id='amount'
                    onChange={this.handelChange}
                    autoFocus
                  />
                  <Label for='amount'>
                    {I18n.t('containers.wallet.receivePage.amount')}
                  </Label>
                  <InputGroupAddon addonType='append'>
                    <InputGroupText>
                      {I18n.t('containers.wallet.receivePage.dFI')}
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </FormGroup>
              <FormGroup className='form-label-group'>
                <Input
                  type='text'
                  value={label}
                  name='label'
                  id='label'
                  onChange={this.handelChange}
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
                  onChange={this.handelChange}
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
                {I18n.t('containers.wallet.receivePage.dFI')}
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
                // disabled={!amount || !message ? true : false}
                onClick={this.onSubmit}
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
  const { paymentRequests } = state.wallet;
  return {
    paymentRequests,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addReceiveTxns: (data: any) => dispatch(addReceiveTxnsRequest(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ReceivePage);
