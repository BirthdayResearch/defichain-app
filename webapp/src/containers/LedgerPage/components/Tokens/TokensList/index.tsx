import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { I18n } from 'react-redux-i18n';
import { connect } from 'react-redux';
import {
  fetchTokensRequest,
  fetchAccountTokensRequest,
  fetchInstantBalanceRequest,
} from '../../../reducer';
import { LEDGER_PATH } from '@/constants';
import { IToken } from 'src/utils/interfaces';
import TokensList from '@/components/TokensList';
import { RootState } from '@/app/rootReducer';
import { StatusLedger } from '@/typings/entities';
import { getWalletPathAddress } from '@/utils/utility';

interface LedgerTokensListProps extends RouteComponentProps {
  tokens: IToken[];
  unit: string;
  accountTokens: IToken[];
  walletBalance: any;
  fetchTokensRequest: () => void;
  fetchAccountTokensRequest: () => void;
  isWalletCreatedFlag: boolean;
  openResetWalletDatModal: boolean;
  isLoadingTokens: boolean;
  status: StatusLedger;
}

const LedgerTokensList: React.FunctionComponent<LedgerTokensListProps> = (
  props: LedgerTokensListProps
) => {
  const {
    unit,
    history,
    tokens,
    isLoadingTokens,
    fetchTokensRequest,
    walletBalance,
    fetchAccountTokensRequest,
    accountTokens,
    status,
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
      {status !== 'connected' ? (
        <div className='main-wrapper'>
          <div>{I18n.t('containers.ledgerPage.tokens.notConnection')}</div>
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
          pagePath={LEDGER_PATH}
        />
      )}
    </>
  );
};

const mapStateToProps = (state: RootState) => {
  const {
    wallet: {
      tokens,
      isLoadingTokens,
      accountTokens,
      isAccountTokensLoaded,
      isAccountLoadingTokens,
    },
    settings: {
      appConfig: { unit },
    },
    popover: { openResetWalletDatModal },
    ledgerWallet: {
      walletBalance,
      connect: { status }
    }
  } = state;
  return {
    unit,
    tokens,
    isLoadingTokens,
    accountTokens,
    isAccountTokensLoaded,
    isAccountLoadingTokens,
    walletBalance,
    openResetWalletDatModal,
    status,
  };
};

const mapDispatchToProps = {
  fetchTokensRequest,
  fetchAccountTokensRequest,
  fetchInstantBalanceRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(LedgerTokensList);
