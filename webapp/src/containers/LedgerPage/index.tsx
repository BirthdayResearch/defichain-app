import React, { useEffect, useState, useCallback } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';
import { I18n } from 'react-redux-i18n';
import { Button, ButtonGroup, Row, Col } from 'reactstrap';
import { MdArrowUpward, MdArrowDownward, MdRefresh } from 'react-icons/md';
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
  fetchInstantPendingBalanceRequest,
  fetchConnectLedgerRequest,
  initialIsShowingInformationRequest,
  updateIsShowingInformationRequest,
  getDevicesClear,
  fetchConnectLedgerFailure,
} from './reducer';
import { startUpdateApp, openBackupWallet } from '../PopOver/reducer';
import { LEDGER_RECEIVE_PATH } from '@/constants';
import { getAmountInSelectedUnit } from '@/utils/utility';
import styles from './LedgerPage.module.scss';
import { DevicesLedger, LedgerConnect } from '@/containers/LedgerPage/types';

interface LedgerPageProps extends RouteComponentProps {
  unit: string;
  walletBalance: string;
  pendingBalance: string;
  fetchInstantBalanceRequest: () => void;
  fetchInstantPendingBalanceRequest: () => void;
  updateAvailableBadge: boolean;
  startUpdateApp: () => void;
  openBackupWallet: () => void;
  blockChainInfo: any;
  connect: LedgerConnect;
  fetchConnectLedgerRequest: () => void;
  isShowingInformation: boolean;
  devices: DevicesLedger;
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
    fetchInstantBalanceRequest,
    unit,
    fetchInstantPendingBalanceRequest,
    updateAvailableBadge,
    startUpdateApp,
    openBackupWallet,
    history,
    fetchConnectLedgerRequest,
    isShowingInformation,
    devices,
    connect,
  } = props;

  useEffect(() => {
    fetchInstantBalanceRequest();
    fetchInstantPendingBalanceRequest();

    return () => {
      clearTimeout(balanceRefreshTimerID);
      clearTimeout(pendingBalRefreshTimerID);
    };
  }, []);

  useEffect(() => {
    dispatch(initialIsShowingInformationRequest());
  }, [dispatch]);

  const openUpdatePopUp = () => {
    openBackupWallet();
    startUpdateApp();
  };

  let balanceRefreshTimerID;
  let pendingBalRefreshTimerID;
  const { walletBalance, pendingBalance } = props;
  const [refreshBalance, setRefreshBalance] = useState(false);
  const [pendingRefreshBalance, setPendingRefreshBalance] = useState(false);
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
            disabled={connect.status !== 'connected'}
          >
            <MdArrowUpward />
            <span className='d-md-inline'>
              {I18n.t('containers.ledger.ledgerPage.send')}
            </span>
          </Button>
          <Button
            to={LEDGER_RECEIVE_PATH}
            tag={RRNavLink}
            color='link'
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
                label={I18n.t('containers.wallet.walletPage.availableBalance')}
                value={
                  tokenAmount
                    ? tokenAmount
                    : getAmountInSelectedUnit(walletBalance, unit)
                }
                unit={tokenSymbol ? tokenSymbol : unit}
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
                      fetchInstantBalanceRequest();
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

const mapStateToProps = (state) => {
  const {
    wallet: { walletBalance, pendingBalance, blockChainInfo },
    settings: {
      appConfig: { unit },
    },
    popover: { updateAvailableBadge },
    ledgerWallet: { connect, isShowingInformation, devices },
  } = state;
  return {
    unit,
    walletBalance,
    pendingBalance,
    updateAvailableBadge,
    blockChainInfo,
    connect,
    isShowingInformation,
    devices,
  };
};

const mapDispatchToProps = {
  fetchInstantBalanceRequest,
  fetchInstantPendingBalanceRequest,
  startUpdateApp,
  openBackupWallet,
  fetchConnectLedgerRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(LedgerPage);
