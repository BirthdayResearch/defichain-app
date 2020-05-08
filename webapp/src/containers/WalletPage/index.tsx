import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Button, ButtonGroup, Row, Col } from 'reactstrap';
import { MdArrowUpward, MdArrowDownward } from 'react-icons/md';
import { NavLink as RRNavLink } from 'react-router-dom';
import StatCard from '../../components/StatCard/StatCard';
import WalletTxns from './components/WalletTxns';
import PaymentRequests from './components/PaymentRequests';
import { I18n } from 'react-redux-i18n';
import { connect } from 'react-redux';
import { fetchWalletBalanceRequest } from './reducer';
import { WALLET_SEND_PATH, WALLET_RECEIVE_PATH } from '../../constants';

interface WalletPageProps {
  walletBalance: string;
  fetchWalletBalance: () => void;
}

const WalletPage: React.FunctionComponent<WalletPageProps> = (
  props: WalletPageProps
) => {
  useEffect(() => {
    props.fetchWalletBalance();
  }, []);

  const { walletBalance } = props;
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
                value={walletBalance}
                unit='DFI'
              />
            </Col>
            <Col>
              <StatCard
                label={I18n.t('containers.wallet.walletPage.pending')}
                value='1,000'
                unit='DFI'
              />
            </Col>
          </Row>
        </section>
        <section>
          <h2>{I18n.t('containers.wallet.walletPage.paymentRequests')}</h2>
          <PaymentRequests />
        </section>
        <section>
          <h2>{I18n.t('containers.wallet.walletPage.transactions')}</h2>
          <WalletTxns />
        </section>
      </div>
    </div>
  );
};

const mapStateToProps = ({ wallet }) => ({
  walletBalance: wallet.walletBalance,
});

const mapDispatchToProps = dispatch => {
  return {
    fetchWalletBalance: () => dispatch(fetchWalletBalanceRequest()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WalletPage);
