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

import { NavLink as RRNavLink, RouteComponentProps } from 'react-router-dom';
import StatCard from '../../components/StatCard';
import WalletTxns from './components/WalletTxns';
import {
  fetchWalletBalanceRequest,
  fetchPendingBalanceRequest,
} from './reducer';
import { WALLET_TOKENS_PATH } from '../../constants';
import { startUpdateApp, openBackupWallet } from '../PopOver/reducer';
import {
  WALLET_SEND_PATH,
  WALLET_RECEIVE_PATH,
  WALLET_CREATE_PATH,
} from '../../constants';
import {
  getAmountInSelectedUnit,
  getNetworkType,
  isWalletCreated,
} from '../../utils/utility';
import { updatePendingBalanceSchedular } from '../../worker/schedular';
import styles from './WalletPage.module.scss';
import Badge from '../../components/Badge';
import CreateOrRestoreWalletPage from './components/CreateOrRestoreWalletPage';

interface WalletPageProps extends RouteComponentProps {
  unit: string;
  walletBalance: string;
  pendingBalance: string;
  fetchWalletBalanceRequest: () => void;
  fetchPendingBalanceRequest: () => void;
  updateAvailableBadge: boolean;
  startUpdateApp: () => void;
  openBackupWallet: () => void;
  blockChainInfo: any;
}

const WalletPage: React.FunctionComponent<WalletPageProps> = (
  props: WalletPageProps
) => {
  const urlParams = new URLSearchParams(props.location.search);
  const tokenSymbol = urlParams.get('symbol');
  const tokenHash = urlParams.get('hash');
  const tokenAmount = urlParams.get('amount');
  const tokenAddress = urlParams.get('address');

  const {
    fetchWalletBalanceRequest,
    unit,
    fetchPendingBalanceRequest,
    updateAvailableBadge,
    startUpdateApp,
    openBackupWallet,
    history,
  } = props;
  const { softforks = {} } = props.blockChainInfo;

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
    <>
      {!isWalletCreated() ? (
        <div className='main-wrapper'>
          <CreateOrRestoreWalletPage history={history} />
        </div>
      ) : (
        <div className='main-wrapper'>
          <Helmet>
            <title>{I18n.t('containers.wallet.walletPage.wallet')}</title>
          </Helmet>
          <header className='header-bar'>
            {softforks.amk && softforks.amk.active && (
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
            )}
            <h1>
              {tokenSymbol ? tokenSymbol : unit}{' '}
              {I18n.t('containers.wallet.walletPage.wallet')}
            </h1>
            {updateAvailableBadge && (
              <Badge
                baseClass='update-available'
                outline
                onClick={openUpdatePopUp}
                label={I18n.t(
                  'containers.wallet.walletPage.updateAvailableLabel'
                )}
              />
            )}
            <ButtonGroup>
              <Button
                to={
                  tokenSymbol
                    ? `${WALLET_SEND_PATH}?symbol=${tokenSymbol}&hash=${tokenHash}&amount=${tokenAmount}&address=${tokenAddress}`
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
                    label={I18n.t(
                      'containers.wallet.walletPage.availableBalance'
                    )}
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
          <footer className='footer-bar'>
            <div>
              <Row className='justify-content-between align-items-center'>
                <Col className='d-flex justify-content-end'>
                  <Button
                    color='link'
                    className='mr-3'
                    onClick={() => {
                      history.push(WALLET_CREATE_PATH);
                    }}
                  >
                    {I18n.t(
                      'containers.wallet.createNewWalletPage.createNewWallet'
                    )}
                  </Button>
                </Col>
              </Row>
            </div>
          </footer>
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  const {
    wallet: { walletBalance, pendingBalance, blockChainInfo },
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
    blockChainInfo,
  };
};

const mapDispatchToProps = {
  fetchWalletBalanceRequest,
  fetchPendingBalanceRequest,
  startUpdateApp,
  openBackupWallet,
};

export default connect(mapStateToProps, mapDispatchToProps)(WalletPage);
