import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Button, ButtonGroup } from 'reactstrap';
import { MdArrowBack, MdAdd } from 'react-icons/md';
import PaymentRequestList from './PaymentRequestList';
import { I18n } from 'react-redux-i18n';
import { NavLink as RRNavLink, RouteComponentProps } from 'react-router-dom';
import {
  LEDGER_CREATE_RECEIVE_REQUEST,
  LEDGER_PATH,
} from '../../../../constants';

const LedgerReceivePage: React.FunctionComponent<RouteComponentProps> = (
  props: RouteComponentProps
) => {
  const urlParams = new URLSearchParams(props.location.search);
  const tokenSymbol = urlParams.get('symbol');
  const tokenHash = urlParams.get('hash');
  const tokenAmount = urlParams.get('amount');
  const tokenAddress = urlParams.get('address');

  return (
    <div className='main-wrapper'>
      <Helmet>
        <title>{I18n.t('containers.wallet.receivePage.receivePage')}</title>
      </Helmet>
      <header className='header-bar'>
        <Button
          to={LEDGER_PATH}
          tag={RRNavLink}
          color='link'
          className='header-bar-back'
        >
          <MdArrowBack />
          <span className='d-lg-inline text-uppercase'>
            {I18n.t('containers.wallet.receivePage.backButton')}
          </span>
        </Button>
        <h1>{I18n.t('containers.wallet.receivePage.receive')}</h1>
        <ButtonGroup>
          <Button
            to={LEDGER_CREATE_RECEIVE_REQUEST}
            tag={RRNavLink}
            color='link'
          >
            <MdAdd />
            <span className='d-lg-inline'>
              {I18n.t('containers.wallet.receivePage.newAddressButton')}
            </span>
          </Button>
        </ButtonGroup>
      </header>
      <div className='content'>
        <section>
          <PaymentRequestList />
        </section>
      </div>
    </div>
  );
};

export default LedgerReceivePage;
