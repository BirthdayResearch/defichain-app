import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Button, ButtonGroup } from 'reactstrap';
import { MdArrowBack, MdAdd } from 'react-icons/md';
import PaymentRequestList from './PaymentRequestList';
import { I18n } from 'react-redux-i18n';
import { NavLink as RRNavLink, RouteComponentProps } from 'react-router-dom';
import {
  WALLET_PAGE_PATH,
  WALLET_CREATE_RECEIVE_REQUEST,
} from '../../../../constants';

const ReceivePage: React.FunctionComponent<RouteComponentProps> = (
  props: RouteComponentProps
) => {
  return (
    <div className='main-wrapper'>
      <Helmet>
        <title>{I18n.t('containers.wallet.receivePage.receivePage')}</title>
      </Helmet>
      <header className='header-bar'>
        <Button
          to={WALLET_PAGE_PATH}
          tag={RRNavLink}
          color='link'
          className='header-bar-back'
        >
          <MdArrowBack />
          <span className='d-lg-inline'>
            {I18n.t('containers.wallet.receivePage.wallet')}
          </span>
        </Button>
        <h1>{I18n.t('containers.wallet.receivePage.receive')}</h1>
        <ButtonGroup>
          <Button
            to={WALLET_CREATE_RECEIVE_REQUEST}
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

export default ReceivePage;
