import React, { useEffect, useState, useCallback } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';
import { I18n } from 'react-redux-i18n';
import { Button, ButtonGroup, Row, Col } from 'reactstrap';
import { MdArrowUpward, MdArrowDownward, MdRefresh, MdArrowBack } from 'react-icons/md';
import { NavLink as RRNavLink, RouteComponentProps } from 'react-router-dom';
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
  clearReceiveTxns,
  addReceiveTxnsRequest,
} from './reducer';
import { startUpdateApp, openBackupWallet } from '../PopOver/reducer';
import {
  DFI_SYMBOL,
  LEDGER_RECEIVE_PATH,
  LEDGER_SEND_PATH,
  LEDGER_SYNC_PATH,
  LEDGER_TOKENS_PATH,
} from '@/constants';
import { getAmountInSelectedUnit, getSymbolKey } from '@/utils/utility';
import * as log from '@/utils/electronLogger';
import styles from './LedgerPage.module.scss';
import { DevicesLedger, LedgerConnect } from '@/containers/LedgerPage/types';
import { RootState } from '@/app/rootReducer';
import { getBackupIndexesLedger, getPubKeyLedger, loadWallet } from './service';
import { uid } from 'uid';
import { getWalletPathAddress } from '@/utils/utility';
import Header from '@/containers/HeaderComponent';

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
  clearReceiveTxns: () => void;
  addReceiveTxns: (data: any) => void;
}

const LedgerPage: React.FunctionComponent<LedgerPageProps> = (
  props: LedgerPageProps
) => {
  const urlParams = new URLSearchParams(props.location.search);
  const tokenSymbol = urlParams.get('symbol');
  const tokenHash = urlParams.get('hash');
  const tokenAmount = urlParams.get('amount');
  const tokenAddress = urlParams.get('address');
  const isLPS = urlParams.get('isLPS') === 'true';
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
    if (connect.status === 'connected') {
      fetchInstantBalance();
    }
    return () => {
      clearTimeout(balanceRefreshTimerID);
    };
  }, [fetchInstantBalance, connect.status]);

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
        `${devices.list[0].deviceModel.productName || 'Ledger'} ${I18n.t(
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
      history.push(
        tokenSymbol
          ? getWalletPathAddress(
              LEDGER_SEND_PATH,
              tokenSymbol,
              tokenHash || '',
              tokenAmount || '',
              tokenAddress || '',
              isLPS
            )
          : LEDGER_SEND_PATH
      );
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

  const handleRestoreKeys = useCallback(async () => {
    log.info('Restore keys');
    props.clearReceiveTxns();
    const indexes = await getBackupIndexesLedger();
    log.info(`Indexes keys: ${indexes}`);
    for (const keyIndex of indexes) {
      const {
        data: { pubkey, address },
      } = await getPubKeyLedger(keyIndex);
      const data = {
        id: uid(),
        keyIndex,
        time: new Date().toString(),
        address,
        pubkey,
      };
      props.addReceiveTxns(data);
      log.info(`Restore keys is finish for ${keyIndex}`);
    }
  }, [getBackupIndexesLedger]);

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
      <Header>
        <Button
          to={`${LEDGER_TOKENS_PATH}?value=${walletBalance}&unit=${unit}`}
          tag={RRNavLink}
          color='link'
          className='header-bar-back'
        >
          <MdArrowBack />
          <span className='d-lg-inline'>
            {I18n.t('containers.ledger.ledgerPage.wallets')}
          </span>
        </Button>
        <div className='d-flex align-items-end'>
          <h1>
            {tokenSymbol
              ? getSymbolKey(tokenSymbol, tokenHash || DFI_SYMBOL)
              : unit}{' '}
            {I18n.t('containers.ledger.ledgerPage.title')}
          </h1>
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
          <Button
            onClick={handleRestoreKeys}
            color='link'
            disabled={connect.status !== 'connected'}
          >
            <span className='d-md-inline'>
              {I18n.t('containers.ledger.ledgerPage.restore')}
            </span>
          </Button>
        </ButtonGroup>
      </Header>
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
        {tokenSymbol && <WalletTxns />}
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
  clearReceiveTxns,
  addReceiveTxns: (data: any) => addReceiveTxnsRequest(data),
};

export default connect(mapStateToProps, mapDispatchToProps)(LedgerPage);
