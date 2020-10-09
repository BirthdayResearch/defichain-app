import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { I18n } from 'react-redux-i18n';
import { Button, ButtonGroup, Row, Col } from 'reactstrap';
import {
  MdArrowUpward,
  MdArrowDownward,
  MdRefresh,
  MdArrowBack,
} from 'react-icons/md';
import { NavLink as RRNavLink } from 'react-router-dom';

import StatCard from '../../components/StatCard';
import WalletTxns from './components/WalletTxns';
import {
  fetchWalletBalanceRequest,
  fetchPendingBalanceRequest,
} from './reducer';
import {
  WALLET_SEND_PATH,
  WALLET_RECEIVE_PATH,
  WALLET_TOKENS_PATH,
} from '../../constants';
import { startUpdateApp, openBackupWallet } from '../PopOver/reducer';
import { getAmountInSelectedUnit } from '../../utils/utility';
import { updatePendingBalanceSchedular } from '../../worker/schedular';
import styles from './WalletPage.module.scss';
import Badge from '../../components/Badge';

interface WalletPageProps {
  location?: any;
  unit: string;
  walletBalance: string;
  pendingBalance: string;
  fetchWalletBalanceRequest: () => void;
  fetchPendingBalanceRequest: () => void;
  updateAvailableBadge: boolean;
  startUpdateApp: () => void;
  openBackupWallet: () => void;
}

const WalletPage: React.FunctionComponent<WalletPageProps> = (
  props: WalletPageProps
) => {
  const urlParams = new URLSearchParams(props.location.search);
  const tokenSymbol = urlParams.get('symbol');
  const tokenHash = urlParams.get('hash');
  const tokenAmount = urlParams.get('amount');

  const {
    fetchWalletBalanceRequest,
    unit,
    fetchPendingBalanceRequest,
    updateAvailableBadge,
    startUpdateApp,
    openBackupWallet,
  } = props;
  useEffect(() => {
    fetchWalletBalanceRequest();
    fetchPendingBalanceRequest();
    const clearPendingBalanceTimer = updatePendingBalanceSchedular();

    return () => {
      clearPendingBalanceTimer();
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

  return (
    <div className='main-wrapper'>
      <Helmet>
        <title>{I18n.t('containers.wallet.walletPage.wallet')}</title>
      </Helmet>
      <header className='header-bar'>
        <Button
          to={WALLET_TOKENS_PATH}
          tag={RRNavLink}
          color='link'
          className='header-bar-back'
        >
          <MdArrowBack />
          <span className='d-lg-inline'>
            {I18n.t('containers.wallet.walletPage.tokens')}
          </span>
        </Button>
        <h1>
          {tokenSymbol ? tokenSymbol : unit}{' '}
          {I18n.t('containers.wallet.walletPage.wallet')}
        </h1>
        {updateAvailableBadge && (
          <Badge
            baseClass='update-available'
            outline
            onClick={openUpdatePopUp}
            label={I18n.t('containers.wallet.walletPage.updateAvailableLabel')}
          />
        )}
        <ButtonGroup>
          <Button
            to={
              tokenSymbol
                ? `${WALLET_SEND_PATH}?symbol=${tokenSymbol}&hash=${tokenHash}&amount=${tokenAmount}`
                : WALLET_SEND_PATH
            }
            tag={RRNavLink}
            color='link'
            size='sm'
          >
            <MdArrowUpward />
            <span className='d-md-inline'>
              {I18n.t('containers.wallet.walletPage.send')}
            </span>
          </Button>
          <Button
            to={WALLET_RECEIVE_PATH}
            tag={RRNavLink}
            color='link'
            size='sm'
          >
            <MdArrowDownward />
            <span className='d-md-inline'>
              {I18n.t('containers.wallet.walletPage.receive')}
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
                      fetchWalletBalanceRequest();
                    }}
                  />
                }
              />
            </Col>
            <Col>
              <StatCard
                label={I18n.t('containers.wallet.walletPage.pending')}
                value={getAmountInSelectedUnit(pendingBalance, unit)}
                unit={unit}
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
                      fetchPendingBalanceRequest();
                    }}
                  />
                }
              />
            </Col>
          </Row>
        </section>
        {!tokenSymbol ? <WalletTxns /> : ''}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  const {
    wallet: { walletBalance, pendingBalance },
    settings: {
      appConfig: { unit },
    },
    popover: { updateAvailableBadge },
  } = state;
  return {
    unit,
    walletBalance,
    pendingBalance,
    updateAvailableBadge,
  };
};

const mapDispatchToProps = {
  fetchWalletBalanceRequest,
  fetchPendingBalanceRequest,
  startUpdateApp,
  openBackupWallet,
};

export default connect(mapStateToProps, mapDispatchToProps)(WalletPage);
