import React, { useEffect, useState, useCallback } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';
import { I18n } from 'react-redux-i18n';
import { Button, ButtonGroup, Row, Col } from 'reactstrap';
import { MdArrowUpward, MdArrowDownward, MdRefresh } from 'react-icons/md';
import { RouteComponentProps } from 'react-router-dom';
import classNames from 'classnames';
import StatusLedgerConnect from '@/components/StatusLedgerConnect';
import StatCard from '../../components/StatCard';
import WalletTxns from './components/WalletTxns';
import HelpModal from './components/HelpModal';
import NotFoundLedgerModal from './components/NotFoundLedgerModal';
import ErrorLedgerModal from './components/ErrorLedgerModal';
import {
  fetchInstantBalanceRequest,
  fetchConnectLedgerRequest,
  initialIsShowingInformationRequest,
  updateIsShowingInformationRequest,
  getDevicesClear,
  fetchConnectLedgerFailure,
} from './reducer';
import { startUpdateApp, openBackupWallet } from '../PopOver/reducer';
import {
  LEDGER_RECEIVE_PATH,
  LEDGER_SEND_PATH,
  LEDGER_SYNC_PATH,
} from '@/constants';
import { getAmountInSelectedUnit, getSymbolKey } from '@/utils/utility';
import styles from './LedgerPage.module.scss';
import { DevicesLedger, LedgerConnect } from '@/containers/LedgerPage/types';
import { RootState } from '@/app/rootReducer';

interface LedgerPageProps extends RouteComponentProps {
  unit: string;
  walletBalance: number;
  fetchInstantBalance: () => void;
  fetchInstantPendingBalanceRequest: () => void;
  updateAvailableBadge: boolean;
  startUpdateApp: () => void;
  openBackupWallet: () => void;
  blockChainInfo: any;
  connect: LedgerConnect;
  fetchConnectLedgerRequest: () => void;
  isShowingInformation: boolean;
  devices: DevicesLedger;
  latestBlock: number;
  latestSyncedBlock: number;
}

const LedgerPage: React.FunctionComponent<LedgerPageProps> = (
  props: LedgerPageProps
) => {
  const urlParams = new URLSearchParams(props.location.search);
  const tokenSymbol = urlParams.get('symbol');
  const tokenHash = urlParams.get('hash');
  const tokenAmount = urlParams.get('amount');
  const tokenAddress = urlParams.get('address');
  const dispatch = useDispatch();

  const {
    fetchInstantBalance,
    unit,
    fetchConnectLedgerRequest,
    isShowingInformation,
    devices,
    connect,
    history,
    latestSyncedBlock,
    latestBlock,
  } = props;

  useEffect(() => {
    fetchInstantBalance();
    return () => {
      clearTimeout(balanceRefreshTimerID);
    };
  }, [fetchInstantBalance]);

  useEffect(() => {
    dispatch(initialIsShowingInformationRequest());
  }, [dispatch]);

  let balanceRefreshTimerID;
  const { walletBalance } = props;
  const [refreshBalance, setRefreshBalance] = useState(false);
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
        `${devices.list[0].deviceModel.productName} ${I18n.t(
          'containers.ledger.ledgerPage.connected'
        )}`
      );
    }
  }, [connect.status]);

  const onConnectLedger = useCallback(() => {
    fetchConnectLedgerRequest();
  }, []);

  const onCloseHelpModal = useCallback(() => {
    dispatch(updateIsShowingInformationRequest(false));
  }, [dispatch]);

  const onCloseNotFoundLedgerModal = useCallback(() => {
    dispatch(getDevicesClear());
  }, [dispatch]);

  const onCloseErrorLedgerModal = useCallback(() => {
    dispatch(fetchConnectLedgerFailure(null));
  }, [dispatch]);

  const handleSendRedirect = useCallback(() => {
    if (latestSyncedBlock > 0 && latestSyncedBlock >= latestBlock) {
      history.push(LEDGER_SEND_PATH);
    } else {
      history.push(LEDGER_SYNC_PATH);
    }
  }, [latestSyncedBlock, latestBlock]);

  const handleReceiveRedirect = useCallback(() => {
    if (latestSyncedBlock > 0 && latestSyncedBlock >= latestBlock) {
      history.push(LEDGER_RECEIVE_PATH);
    } else {
      history.push(LEDGER_SYNC_PATH);
    }
  }, [latestSyncedBlock, latestBlock]);

  return (
    <div className='main-wrapper'>
      <HelpModal isOpen={isShowingInformation} toggle={onCloseHelpModal} />
      <NotFoundLedgerModal
        isOpen={!devices.list.length && !!devices.error}
        toggle={onCloseNotFoundLedgerModal}
      />
      <ErrorLedgerModal
        isOpen={!!connect.error}
        error={connect.error ? connect.error.message : ''}
        onAgainClick={onConnectLedger}
        toggle={onCloseErrorLedgerModal}
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
            onClick={onConnectLedger}
            disabled={connect.status !== 'notConnected'}
          >
            <span>{connectLabel}</span>
            <StatusLedgerConnect status={connect.status} />
          </button>
        </div>
        <ButtonGroup>
          <Button
            color='link'
            size='sm'
            onClick={handleSendRedirect}
            disabled={connect.status !== 'connected'}
          >
            <MdArrowUpward />
            <span className='d-md-inline'>
              {I18n.t('containers.ledger.ledgerPage.send')}
            </span>
          </Button>
          <Button
            onClick={handleReceiveRedirect}
            color='link'
            disabled={connect.status !== 'connected'}
          >
            <MdArrowDownward />
            <span className='d-md-inline'>
              {I18n.t('containers.ledger.ledgerPage.receive')}
            </span>
          </Button>
        </ButtonGroup>
      </header>
      <div className='content'>
        <section>
          <Row>
            <Col>
              <StatCard
                label={I18n.t('containers.ledger.ledgerPage.availableBalance')}
                value={
                  tokenAmount
                    ? tokenAmount
                    : getAmountInSelectedUnit(walletBalance, unit)
                }
                unit={
                  tokenSymbol
                    ? getSymbolKey(tokenSymbol, tokenHash || '0')
                    : unit
                }
                refreshFlag={refreshBalance}
                icon={
                  <MdRefresh
                    className={styles.iconPointer}
                    size={30}
                    onClick={() => {
                      setRefreshBalance(true);
                      balanceRefreshTimerID = setTimeout(() => {
                        setRefreshBalance(false);
                      }, 2000);
                      fetchInstantBalance();
                    }}
                  />
                }
              />
            </Col>
          </Row>
        </section>
        {!tokenSymbol && <WalletTxns />}
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  const {
    settings: {
      appConfig: { unit },
    },
    popover: { updateAvailableBadge },
    ledgerWallet: {
      connect,
      isShowingInformation,
      devices,
      walletBalance,
      blockChainInfo,
    },
    syncstatus: { latestBlock, latestSyncedBlock },
  } = state;
  return {
    unit,
    walletBalance,
    updateAvailableBadge,
    blockChainInfo,
    connect,
    isShowingInformation,
    devices,
    latestBlock,
    latestSyncedBlock,
  };
};

const mapDispatchToProps = {
  fetchInstantBalance: fetchInstantBalanceRequest,
  startUpdateApp,
  openBackupWallet,
  fetchConnectLedgerRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(LedgerPage);
