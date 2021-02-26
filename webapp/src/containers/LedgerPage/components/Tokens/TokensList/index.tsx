import React, { useEffect, useCallback, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { I18n } from 'react-redux-i18n';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import {
  fetchTokensRequest,
  fetchAccountTokensRequest,
  fetchInstantBalanceRequest,
} from '../../../reducer';
import {
  updateIsShowingInformationRequest,
  getDevicesClear,
  fetchConnectLedgerRequest,
  fetchConnectLedgerFailure,
} from '@/containers/LedgerPage/reducer';
import { LEDGER_PATH } from '@/constants';
import { IToken } from 'src/utils/interfaces';
import TokensList from '@/components/TokensList';
import { RootState } from '@/app/rootReducer';
import { StatusLedger } from '@/typings/entities';
import { getWalletPathAddress } from '@/utils/utility';
import HelpModal from '../../HelpModal';
import NotFoundLedgerModal from '../../NotFoundLedgerModal';
import ErrorLedgerModal from '../../ErrorLedgerModal';
import { LedgerConnect, DevicesLedger, IAccountTokensState } from '../../../types';
import classNames from 'classnames';
import styles from '@/containers/LedgerPage/LedgerPage.module.scss';
import StatusLedgerConnect from '@/components/StatusLedgerConnect';

interface LedgerTokensListProps extends RouteComponentProps {
  tokens: IToken[];
  unit: string;
  accountTokens: IAccountTokensState;
  walletBalance: any;
  fetchTokensRequest: () => void;
  fetchAccountTokensRequest: () => void;
  isWalletCreatedFlag: boolean;
  openResetWalletDatModal: boolean;
  isLoadingTokens: boolean;
  connect: LedgerConnect;
  isShowingInformation: boolean;
  devices: DevicesLedger;
  updateIsShowingInformation: (isShowing: boolean) => void;
  getDevicesClear: () => void;
  fetchConnectLedger: () => void;
  fetchConnectLedgerFailure: (error: any) => void;
  fetchInstantBalance: () => void;
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
    connect,
    isShowingInformation,
    devices,
    updateIsShowingInformation,
    getDevicesClear,
    fetchConnectLedger,
    fetchConnectLedgerFailure,
    fetchInstantBalance,
  } = props;

  const [connectLabel, setConnectLabel] = useState(
    I18n.t('containers.ledger.ledgerPage.connect')
  );

  useEffect(() => {
    if (connect.status === 'notConnected') {
      setConnectLabel(I18n.t('containers.ledger.ledgerPage.connect'));
    } else if (connect.status === 'connecting') {
      setConnectLabel(I18n.t('containers.ledger.ledgerPage.connecting'));
    } else if (connect.status === 'connected') {
      setConnectLabel(
        `${devices.list[0].deviceModel.productName || 'Ledger'} ${I18n.t(
          'containers.ledger.ledgerPage.connected'
        )}`
      );
    }
  }, [connect.status]);

  useEffect(() => {
    if (connect.status === 'connected') {
      fetchTokensRequest();
      fetchInstantBalance();
      fetchAccountTokensRequest();
    }
  }, [connect.status]);

  const onCloseHelpModal = () => {
    updateIsShowingInformation(false);
  };

  return (
    <div className='main-wrapper'>
      <HelpModal isOpen={isShowingInformation} toggle={onCloseHelpModal} />
      <NotFoundLedgerModal
        isOpen={!devices.list.length && !!devices.error}
        toggle={getDevicesClear}
      />
      <ErrorLedgerModal
        isOpen={!!connect.error}
        error={connect.error ? connect.error.message : ''}
        onAgainClick={fetchConnectLedger}
        toggle={() => fetchConnectLedgerFailure(null)}
      />
      <Helmet>
        <title>{I18n.t('containers.ledger.ledgerPage.title')}</title>
      </Helmet>
      <header className='header-bar'>
        <div className='d-flex align-items-end'>
          <h1>{I18n.t('containers.ledger.ledgerPage.title')}</h1>
          <button
            className={classNames(
              styles.connectButton,
              'd-flex',
              'align-items-center'
            )}
            onClick={fetchConnectLedger}
            disabled={connect.status !== 'notConnected'}
          >
            <span>{connectLabel}</span>
            <StatusLedgerConnect status={connect.status} />
          </button>
        </div>
      </header>
      <div>
        {connect.status !== 'connected' ? (
        <div>{I18n.t('containers.ledger.tokens.notConnection')}</div>) : (
        <>
          {isLoadingTokens ? (
            <div>{I18n.t('containers.tokens.tokensPage.loading')}</div>
          ) : (
            <TokensList
              tokens={tokens}
              unit={unit}
              accountTokens={accountTokens.data}
              walletBalance={walletBalance}
              getPathAddress={getWalletPathAddress}
              history={history}
              isLoadingTokens={isLoadingTokens}
              pagePath={LEDGER_PATH}
            />
          )}
        </>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  const {
    wallet: {
      tokens,
      isLoadingTokens,
    },
    settings: {
      appConfig: { unit },
    },
    popover: { openResetWalletDatModal },
    ledgerWallet: { walletBalance, connect, isShowingInformation, devices, accountTokens },
  } = state;
  return {
    unit,
    tokens,
    isLoadingTokens,
    accountTokens,
    walletBalance,
    openResetWalletDatModal,
    connect,
    isShowingInformation,
    devices,
  };
};

const mapDispatchToProps = {
  fetchTokensRequest,
  fetchAccountTokensRequest,
  fetchInstantBalance: fetchInstantBalanceRequest,
  updateIsShowingInformation: updateIsShowingInformationRequest,
  getDevicesClear,
  fetchConnectLedger: fetchConnectLedgerRequest,
  fetchConnectLedgerFailure,
};

export default connect(mapStateToProps, mapDispatchToProps)(LedgerTokensList);
