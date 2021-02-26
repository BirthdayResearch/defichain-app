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
