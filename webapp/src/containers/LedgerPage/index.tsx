import React, { useEffect, useState, useCallback } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';
import { I18n } from 'react-redux-i18n';
import { Button, ButtonGroup, Row, Col, Badge } from 'reactstrap';
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
} from './reducer';
import { startUpdateApp, openBackupWallet } from '../PopOver/reducer';
import { LEDGER_RECEIVE_PATH } from '@/constants';
import { getAmountInSelectedUnit } from '@/utils/utility';
import { connectLedger } from '@/containers/LedgerPage/service';
import styles from './LedgerPage.module.scss';
import { LedgerConnect } from '@/containers/LedgerPage/types';

interface WalletPageProps extends RouteComponentProps {
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
}

const LedgerPage: React.FunctionComponent<WalletPageProps> = (
  props: WalletPageProps
) => {
  const urlParams = new URLSearchParams(props.location.search);
  const tokenSymbol = urlParams.get('symbol');
  const tokenHash = urlParams.get('hash');
  const tokenAmount = urlParams.get('amount');
  const tokenAddress = urlParams.get('address');
  const dispatch = useDispatch();
  const {
    connect: { status },
  } = props;

  const {
    fetchInstantBalanceRequest,
    unit,
    fetchInstantPendingBalanceRequest,
    updateAvailableBadge,
    startUpdateApp,
    openBackupWallet,
    history,
    fetchConnectLedgerRequest,
  } = props;

  useEffect(() => {
    fetchInstantBalanceRequest();
    fetchInstantPendingBalanceRequest();

    return () => {
      clearTimeout(balanceRefreshTimerID);
      clearTimeout(pendingBalRefreshTimerID);
    };
  }, []);

  const openUpdatePopUp = () => {
    openBackupWallet();
    startUpdateApp();
  };

  let balanceRefreshTimerID;
  let pendingBalRefreshTimerID;
  const { walletBalance, pendingBalance } = props;
  const [refreshBalance, setRefreshBalance] = useState(false);
  const [pendingRefreshBalance, setPendingRefreshBalance] = useState(false);

  const onConnectLedger = useCallback(() => {
    fetchConnectLedgerRequest();
  }, []);

  return (
    <div className='main-wrapper'>
      <HelpModal isOpen={false} />
      <NotFoundLedgerModal isOpen={false} />
      <ErrorLedgerModal
        isOpen={true}
        error='Listen time is out'
        onAgainClick={onConnectLedger}
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
            disabled={status !== 'notConnected'}
          >
            <span>
              {I18n.t(
                `containers.ledger.ledgerPage.${
                  status === 'connecting' ? 'connecting' : 'connect'
                }`
              )}
            </span>
            <StatusLedgerConnect status={status} />
          </button>
        </div>
        <ButtonGroup>
          <Button color='link' size='sm' disabled={status !== 'connected'}>
            <MdArrowUpward />
            <span className='d-md-inline'>
              {I18n.t('containers.ledger.ledgerPage.send')}
            </span>
          </Button>
          <Button
            to={LEDGER_RECEIVE_PATH}
            tag={RRNavLink}
            color='link'
            disabled={status !== 'connected'}
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
            <Col>
              <StatCard
                label={I18n.t('containers.wallet.walletPage.pending')}
                value={getAmountInSelectedUnit(pendingBalance, unit)}
                unit={tokenSymbol ? tokenSymbol : unit}
                refreshFlag={pendingRefreshBalance}
                icon={
                  <MdRefresh
                    className={styles.iconPointer}
                    size={30}
                    onClick={() => {
                      setPendingRefreshBalance(true);
                      pendingBalRefreshTimerID = setTimeout(() => {
                        setPendingRefreshBalance(false);
                      }, 2000);
                      fetchInstantPendingBalanceRequest();
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
    ledgerWallet: { connect },
  } = state;
  return {
    unit,
    walletBalance,
    pendingBalance,
    updateAvailableBadge,
    blockChainInfo,
    connect,
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
