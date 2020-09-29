import React from 'react';
import { NavLink as RRNavLink, RouteComponentProps } from 'react-router-dom';
import { I18n } from 'react-redux-i18n';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { MdAdd } from 'react-icons/md';
import { Button, ButtonGroup } from 'reactstrap';

import {
  WALLET_ADD_TOKEN_PATH,
  WALLET_PAGE_PATH,
} from '../../../../../constants';
import WalletTokenCard from '../../../../../components/TokenCard/WalletTokenCard';

interface WalletTokensListProps extends RouteComponentProps {}

const WalletTokensList: React.FunctionComponent<WalletTokensListProps> = (
  props: WalletTokensListProps
) => {
  const handleCardClick = () => {
    props.history.push(WALLET_PAGE_PATH);
  };

  return (
    <div className='main-wrapper'>
      <Helmet>
        <title>
          {I18n.t('containers.wallet.walletTokensPage.walletTokens')}
        </title>
      </Helmet>
      <header className='header-bar'>
        <h1>{I18n.t('containers.wallet.walletTokensPage.tokens')}</h1>
        <ButtonGroup>
          <Button to={WALLET_ADD_TOKEN_PATH} tag={RRNavLink} color='link'>
            <MdAdd />
            <span className='d-lg-inline'>
              {I18n.t('containers.wallet.walletTokensPage.addToken')}
            </span>
          </Button>
        </ButtonGroup>
      </header>
      <div className='content'>
        <WalletTokenCard handleCardClick={handleCardClick} />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  const { tokens, isTokensLoaded, isLoadingTokens } = state.tokens;
  return {
    tokens,
    isTokensLoaded,
    isLoadingTokens,
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(WalletTokensList);
