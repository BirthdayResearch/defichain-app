import React from 'react';
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
import Header from '../../../HeaderComponent';
import { getPageTitle } from '../../../../utils/utility';
import { WalletPathEnum } from '../../types';
import { getWalletPathAddress } from '../../service';
import { useDispatch } from 'react-redux';
import { getNewSPVAddress } from '../../reducer';

const ReceivePage: React.FunctionComponent<RouteComponentProps> = (
  props: RouteComponentProps
) => {
  const urlParams = new URLSearchParams(props.location.search);
  const tokenSymbol = urlParams.get(WalletPathEnum.symbol);
  const tokenHash = urlParams.get(WalletPathEnum.hash);
  const tokenAmount = urlParams.get('amount');
  const tokenAddress = urlParams.get(WalletPathEnum.address);
  const isLPS = urlParams.get(WalletPathEnum.isLPS) == 'true';
  const isSPV = urlParams.get(WalletPathEnum.isSPV) == 'true';
  const displayName = urlParams.get(WalletPathEnum.displayName);
  const isDAT = urlParams.get(WalletPathEnum.isDAT) == 'true';

  const dispatch = useDispatch();

  return (
    <div className='main-wrapper'>
      <Helmet>
        <title>
          {getPageTitle(I18n.t('containers.wallet.receivePage.receive'))}
        </title>
      </Helmet>
      <Header>
        <Button
          to={
            tokenSymbol
              ? getWalletPathAddress(
                  WALLET_PAGE_PATH,
                  tokenSymbol,
                  tokenHash || '',
                  tokenAmount || '',
                  tokenAddress || '',
                  isLPS,
                  isSPV,
                  displayName || '',
                  isDAT
                )
              : WALLET_PAGE_PATH
          }
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
          {isSPV ? (
            <Button onClick={() => dispatch(getNewSPVAddress())} color='link'>
              <MdAdd />
              <span className='d-lg-inline'>
                {I18n.t('containers.wallet.receivePage.newAddressButton')}
              </span>
            </Button>
          ) : (
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
          )}
        </ButtonGroup>
      </Header>
      <div className='content'>
        <section>
          <PaymentRequestList isSPV={isSPV} />
        </section>
      </div>
    </div>
  );
};

export default ReceivePage;
