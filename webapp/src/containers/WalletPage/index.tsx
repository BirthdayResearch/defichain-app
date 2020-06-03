import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Button, ButtonGroup, Row, Col } from 'reactstrap';
import { MdArrowUpward, MdArrowDownward } from 'react-icons/md';
import { NavLink as RRNavLink } from 'react-router-dom';
import StatCard from '../../components/StatCard';
import WalletTxns from './components/WalletTxns';
import PaymentRequests from './components/PaymentRequests';
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
    };
  }, []);

  const { walletBalance, pendingBalance } = props;
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
              />
            </Col>
            <Col>
              <StatCard
                label={I18n.t('containers.wallet.walletPage.pending')}
                value={getAmountInSelectedUnit(pendingBalance, props.unit)}
                unit={props.unit}
              />
            </Col>
          </Row>
        </section>
        <PaymentRequests />
        <WalletTxns />
      </div>
    </div>
  );
};

const mapStateToProps = state => {
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
