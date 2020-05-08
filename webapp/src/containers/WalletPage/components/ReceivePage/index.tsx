import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
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
import { fetchReceivedDataRequest } from '../../reducer';
import { WALLET_BASE_PATH } from '../../../../constants';

interface ReceivePageProps {
  receivedData: {
    amountToReceive: string;
    amountToReceiveDisplayed: number;
    receiveMessage: string;
    showBackdrop: string;
    receiveStep: string;
  };
  fetchReceivedData: () => void;
}

interface ReceivePageState {
  amountToReceive: string;
  amountToReceiveDisplayed: number;
  receiveMessage: string;
  showBackdrop: string;
  receiveStep: string;
}

class ReceivePage extends Component<ReceivePageProps, ReceivePageState> {
  state = {
    amountToReceive: '',
    amountToReceiveDisplayed: 0,
    receiveMessage: '',
    showBackdrop: '',
    receiveStep: 'default',
  };

  componentDidMount() {
    this.props.fetchReceivedData();
  }

  updateAmountToReceive = e => {
    const amountToReceive =
      !isNaN(e.target.value) && e.target.value.length ? e.target.value : '';
    const amountToReceiveDisplayed =
      !isNaN(amountToReceive) && amountToReceive.length ? amountToReceive : '0';
    this.setState({
      amountToReceive,
      amountToReceiveDisplayed,
    });
  };
  // tslint:disable-next-line:no-empty
  receiveStepConfirm = () => {};
  render() {
    return (
      <div className='main-wrapper'>
        <Helmet>
          <title>
            {I18n.t('containers.wallet.receivePage.receiveDFITitle')}
          </title>
        </Helmet>
        <header className='header-bar'>
          <Button to='/' tag={NavLink} color='link' className='header-bar-back'>
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
                    type='text'
                    inputMode='numeric'
                    placeholder={I18n.t(
                      'containers.wallet.receivePage.amountToReceive'
                    )}
                    name='amountToReceive'
                    id='amountToReceive'
                    onChange={this.updateAmountToReceive}
                    autoFocus
                  />
                  <Label for='amountToReceive'>
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
                  type='textarea'
                  name='message'
                  id='message'
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
                {this.state.amountToReceiveDisplayed}&nbsp;
                {I18n.t('containers.wallet.receivePage.dFI')}
              </div>
            </div>
            <div>
              <Button
                to={WALLET_BASE_PATH}
                tag={NavLink}
                color='link'
                className='mr-3'
              >
                {I18n.t('containers.wallet.receivePage.cancel')}
              </Button>
              <Button
                color='primary'
                disabled={
                  !this.state.amountToReceive || !this.state.receiveMessage
                    ? true
                    : false
                }
                onClick={this.receiveStepConfirm}
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
  const { receivedData } = state.wallet;
  return {
    receivedData,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchReceivedData: () => dispatch(fetchReceivedDataRequest()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ReceivePage);
