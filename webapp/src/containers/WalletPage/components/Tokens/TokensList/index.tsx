import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { I18n } from 'react-redux-i18n';
import { connect } from 'react-redux';
import {
  fetchTokensRequest,
  fetchAccountTokensRequest,
  fetchInstantBalanceRequest,
} from '../../../reducer';
import { WALLET_PAGE_PATH } from '@/constants';
import CreateOrRestoreWalletPage from '../../CreateOrRestoreWalletPage';
import { IToken } from 'src/utils/interfaces';
import { getWalletPathAddress } from '../../SendPage';
import TokensList from '@/components/TokensList';
import { Helmet } from 'react-helmet';
import { getPageTitle } from '@/utils/utility';
import Header from '@/containers/HeaderComponent';

interface WalletTokensListProps extends RouteComponentProps {
  tokens: IToken[];
  unit: string;
  accountTokens: IToken[];
  walletBalance: any;
  fetchTokensRequest: () => void;
  fetchAccountTokensRequest: () => void;
  isWalletCreatedFlag: boolean;
  openResetWalletDatModal: boolean;
  isLoadingTokens: boolean;
}

const WalletTokensList: React.FunctionComponent<WalletTokensListProps> = (
  props: WalletTokensListProps
) => {
  const {
    unit,
    history,
    isWalletCreatedFlag,
    tokens,
    isLoadingTokens,
    fetchTokensRequest,
    walletBalance,
    fetchAccountTokensRequest,
    accountTokens,
  } = props;

  useEffect(() => {
    fetchTokensRequest();
    fetchInstantBalanceRequest();
    fetchAccountTokensRequest();
  }, []);

  return isLoadingTokens ? (
    <div>{I18n.t('containers.tokens.tokensPage.loading')}</div>
  ) : (
    <>
      {!isWalletCreatedFlag ? (
        <div className='main-wrapper'>
          <CreateOrRestoreWalletPage history={history} />
        </div>
      ) : (
        <div className='main-wrapper'>
          <Helmet>
            <title>
              {getPageTitle(
                I18n.t('containers.wallet.walletPage.walletDeFiApp')
              )}
            </title>
          </Helmet>
          <Header>
            <h1>{I18n.t('containers.wallet.walletPage.wallets')}</h1>
            {/* <ButtonGroup>
            <Button to={WALLET_ADD_TOKEN_PATH} tag={RRNavLink} color='link'>
              <MdAdd />
              <span className='d-lg-inline'>
                {I18n.t('containers.wallet.walletWalletsPage.addWallet')}
              </span>
            </Button>
          </ButtonGroup> */}
          </Header>
          <TokensList
            tokens={tokens}
            unit={unit}
            accountTokens={accountTokens}
            walletBalance={walletBalance}
            getPathAddress={getWalletPathAddress}
            history={history}
            isLoadingTokens={isLoadingTokens}
            pagePath={WALLET_PAGE_PATH}
          />
        </div>
      )}
    </>
  );
};


const mapStateToProps = (state) => {
  const {
    wallet: {
      tokens,
      isTokensLoaded,
      isLoadingTokens,
      accountTokens,
      isAccountTokensLoaded,
      isAccountLoadingTokens,
      walletBalance,
      isWalletCreatedFlag,
    },
    settings: {
      appConfig: { unit },
    },
    popover: { openResetWalletDatModal },
  } = state;
  return {
    unit,
    tokens,
    isTokensLoaded,
    isLoadingTokens,
    accountTokens,
    isAccountTokensLoaded,
    isAccountLoadingTokens,
    walletBalance,
    isWalletCreatedFlag,
    openResetWalletDatModal,
  };
};

const mapDispatchToProps = {
  fetchTokensRequest,
  fetchAccountTokensRequest,
  fetchInstantBalanceRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(WalletTokensList);
