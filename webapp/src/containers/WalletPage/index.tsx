import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Button, ButtonGroup, Row, Col } from 'reactstrap';
import { MdArrowUpward, MdArrowDownward, MdRefresh } from 'react-icons/md';
import { NavLink as RRNavLink } from 'react-router-dom';
import StatCard from '../../components/StatCard';
import WalletTxns from './components/WalletTxns';
import { I18n } from 'react-redux-i18n';
import { connect } from 'react-redux';
import {
  fetchWalletBalanceRequest,
  fetchPendingBalanceRequest,
} from './reducer';
import { WALLET_SEND_PATH, WALLET_RECEIVE_PATH } from '../../constants';
import { getAmountInSelectedUnit } from '../../utils/utility';
import {
  updateWalletBalanceSchedular,
  updatePendingBalanceSchedular,
  walletBalanceTimerID,
  pendingBalanceTimerID,
} from '../../worker/schedular';
import styles from './WalletPage.module.scss';

interface WalletPageProps {
  unit: string;
  walletBalance: string;
  pendingBalance: string;
  fetchWalletBalanceRequest: () => void;
  fetchPendingBalanceRequest: () => void;
}

const WalletPage: React.FunctionComponent<WalletPageProps> = (
  props: WalletPageProps
) => {
  useEffect(() => {
    props.fetchWalletBalanceRequest();
    props.fetchPendingBalanceRequest();

    updateWalletBalanceSchedular();
    updatePendingBalanceSchedular();

    return () => {
      clearInterval(walletBalanceTimerID);
      clearInterval(pendingBalanceTimerID);
      clearTimeout(balanceRefreshTimerID);
      clearTimeout(pendingBalRefreshTimerID);
    };
  }, []);
  let balanceRefreshTimerID;
  let pendingBalRefreshTimerID;
  const { walletBalance, pendingBalance } = props;
  const [refreshBalance, setRefreshBalance] = useState(false);
  const [pendingRefreshBalance, setPendingRefreshBalance] = useState(false);
  return (
    <div className='main-wrapper'>
      <Helmet>
        <title>{I18n.t('containers.wallet.walletPage.walletDefiClient')}</title>
      </Helmet>
      <header className='header-bar'>
        <h1>{I18n.t('containers.wallet.walletPage.wallet')}</h1>
        <ButtonGroup>
          <Button to={WALLET_SEND_PATH} tag={RRNavLink} color='link' size='sm'>
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
                value={getAmountInSelectedUnit(walletBalance, props.unit)}
                unit={props.unit}
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
                      props.fetchWalletBalanceRequest();
                    }}
                  />
                }
              />
            </Col>
            <Col>
              <StatCard
                label={I18n.t('containers.wallet.walletPage.pending')}
                value={getAmountInSelectedUnit(pendingBalance, props.unit)}
                unit={props.unit}
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
                      props.fetchPendingBalanceRequest();
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
  );
};

const mapStateToProps = (state) => {
  const { wallet, settings } = state;
  return {
    unit: settings.appConfig.unit,
    walletBalance: wallet.walletBalance,
    pendingBalance: wallet.pendingBalance,
  };
};

const mapDispatchToProps = {
  fetchWalletBalanceRequest,
  fetchPendingBalanceRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(WalletPage);
