import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Button, ButtonGroup, Row, Col } from 'reactstrap';
import { MdArrowUpward, MdArrowDownward, MdRefresh } from 'react-icons/md';
import { NavLink as RRNavLink, RouteComponentProps } from 'react-router-dom';
import StatCard from '../../components/StatCard';
import WalletTxns from './components/WalletTxns';
import { I18n } from 'react-redux-i18n';
import { connect } from 'react-redux';
import {
  fetchInstantBalanceRequest,
  fetchInstantPendingBalanceRequest,
} from './reducer';
import { startUpdateApp, openBackupWallet } from '../PopOver/reducer';
import {
  WALLET_SEND_PATH,
  WALLET_RECEIVE_PATH,
  MAIN,
  IS_WALLET_CREATED_MAIN,
  IS_WALLET_CREATED_TEST,
} from '../../constants';
import { getAmountInSelectedUnit, getNetworkType } from '../../utils/utility';
import styles from './WalletPage.module.scss';
import Badge from '../../components/Badge';
import PersistentStore from '../../utils/persistentStore';
import CreateOrRestoreWalletPage from './components/CreateOrRestoreWalletPage';

interface WalletPageProps extends RouteComponentProps {
  unit: string;
  walletBalance: string;
  pendingBalance: string;
  fetchInstantBalanceRequest: () => void;
  fetchInstantPendingBalanceRequest: () => void;
  updateAvailableBadge: boolean;
  startUpdateApp: () => void;
  openBackupWallet: () => void;
}

const WalletPage: React.FunctionComponent<WalletPageProps> = (
  props: WalletPageProps
) => {
  const {
    fetchInstantBalanceRequest,
    unit,
    fetchInstantPendingBalanceRequest,
    updateAvailableBadge,
    startUpdateApp,
    openBackupWallet,
    history,
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

  const isWalletCreated = () => {
    const networkType = getNetworkType();
    const key =
      networkType === MAIN ? IS_WALLET_CREATED_MAIN : IS_WALLET_CREATED_TEST;
    return PersistentStore.get(key) || false;
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
            <title>
              {I18n.t('containers.wallet.walletPage.walletDefiClient')}
            </title>
          </Helmet>
          <header className='header-bar'>
            <h1>{I18n.t('containers.wallet.walletPage.wallet')}</h1>
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
                to={WALLET_SEND_PATH}
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
                    value={getAmountInSelectedUnit(walletBalance, unit)}
                    unit={unit}
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
                          fetchInstantPendingBalanceRequest();
                        }}
                      />
                    }
                  />
                </Col>
              </Row>
            </section>
            <WalletTxns />
          </div>
        </div>
      )}
    </>
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
  fetchInstantBalanceRequest,
  fetchInstantPendingBalanceRequest,
  startUpdateApp,
  openBackupWallet,
};

export default connect(mapStateToProps, mapDispatchToProps)(WalletPage);
