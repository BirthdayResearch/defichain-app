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
import WalletTxns from './components/WalletTxnsNew';
import {
  fetchInstantBalanceRequest,
  fetchInstantPendingBalanceRequest,
} from './reducer';
import { DFI_SYMBOL, WALLET_TOKENS_PATH } from '../../constants';
import { startUpdateApp, openBackupWallet } from '../PopOver/reducer';
import { WALLET_SEND_PATH, WALLET_RECEIVE_PATH } from '../../constants';
import {
  getAmountInSelectedUnit,
  getPageTitle,
  getSymbolKey,
} from '../../utils/utility';
import styles from './WalletPage.module.scss';
import TokenAvatar from '../../components/TokenAvatar';
import Header from '../HeaderComponent';
import { getWalletPathAddress } from './components/SendPage';

interface WalletPageProps extends RouteComponentProps {
  unit: string;
  walletBalance: string;
  pendingBalance: string;
  fetchInstantBalanceRequest: () => void;
  fetchInstantPendingBalanceRequest: () => void;
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
  const isLPS = urlParams.get('isLPS') == 'true';

  const {
    fetchInstantBalanceRequest,
    unit,
    fetchInstantPendingBalanceRequest,
    walletBalance,
    pendingBalance,
  } = props;

  useEffect(() => {
    fetchInstantBalanceRequest();
    fetchInstantPendingBalanceRequest();

    return () => {
      clearTimeout(balanceRefreshTimerID);
      clearTimeout(pendingBalRefreshTimerID);
    };
  }, []);

  let balanceRefreshTimerID;
  let pendingBalRefreshTimerID;
  const [refreshBalance, setRefreshBalance] = useState(false);
  const [pendingRefreshBalance, setPendingRefreshBalance] = useState(false);

  return (
    <div className='main-wrapper'>
      <Helmet>
        <title>
          {getPageTitle(I18n.t('containers.wallet.walletPage.walletDeFiApp'))}
        </title>
      </Helmet>
      <Header>
        <Button
          to={`${WALLET_TOKENS_PATH}?value=${walletBalance}&unit=${unit}`}
          tag={RRNavLink}
          color='link'
          className='header-bar-back'
        >
          <MdArrowBack />
          <span className='d-lg-inline'>
            {I18n.t('containers.wallet.walletPage.balances')}
          </span>
        </Button>
        <div className={styles.titleWithIcon}>
          <TokenAvatar
            symbol={
              tokenSymbol
                ? getSymbolKey(tokenSymbol, tokenHash || DFI_SYMBOL)
                : unit
            }
          />
          <h1>
            {tokenSymbol
              ? getSymbolKey(tokenSymbol, tokenHash || DFI_SYMBOL, isLPS)
              : unit}{' '}
            {I18n.t('containers.wallet.walletPage.wallet')}
          </h1>
        </div>
        <ButtonGroup>
          <Button
            to={
              tokenSymbol
                ? getWalletPathAddress(
                    WALLET_SEND_PATH,
                    tokenSymbol,
                    tokenHash || '',
                    tokenAmount || '',
                    tokenAddress || '',
                    isLPS
                  )
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
            to={
              tokenSymbol
                ? getWalletPathAddress(
                    WALLET_RECEIVE_PATH,
                    tokenSymbol,
                    tokenHash || '',
                    tokenAmount || '',
                    tokenAddress || '',
                    isLPS
                  )
                : WALLET_RECEIVE_PATH
            }
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
      </Header>
      <div className='content'>
        <section>
          <Row>
            <Col>
              <StatCard
                label={I18n.t('containers.wallet.walletPage.availableBalance')}
                value={tokenAmount ? tokenAmount : walletBalance}
                unit={
                  tokenSymbol
                    ? getSymbolKey(tokenSymbol, tokenHash || DFI_SYMBOL)
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
                      fetchInstantBalanceRequest();
                    }}
                  />
                }
              />
            </Col>
            {/* <Col>
              <StatCard
                label={I18n.t('containers.wallet.walletPage.pending')}
                value={getAmountInSelectedUnit(pendingBalance, unit)}
                unit={
                  tokenSymbol
                    ? getSymbolKey(tokenSymbol, tokenHash || DFI_SYMBOL)
                    : unit
                }
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
            </Col> */}
          </Row>
        </section>
        <WalletTxns
          tokenSymbol={
            tokenSymbol
              ? getSymbolKey(tokenSymbol, tokenHash || DFI_SYMBOL, isLPS)
              : unit
          }
        />
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
  } = state;
  return {
    unit,
    walletBalance,
    pendingBalance,
    blockChainInfo,
  };
};

const mapDispatchToProps = {
  fetchInstantBalanceRequest,
  fetchInstantPendingBalanceRequest,
  startUpdateApp,
  openBackupWallet,
};

export default connect(mapStateToProps, mapDispatchToProps)(WalletPage);
