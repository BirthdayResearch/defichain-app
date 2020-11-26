import React, { useEffect, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import { Nav, NavItem, NavLink } from 'reactstrap';
import {
  NavLink as RRNavLink,
  withRouter,
  RouteComponentProps,
} from 'react-router-dom';
import { I18n } from 'react-redux-i18n';
import { connect } from 'react-redux';
import {
  MdAccountBalanceWallet,
  MdDns,
  MdViewWeek,
  MdToll,
  MdCompareArrows,
  MdPieChart,
  // MdCompareArrows,
  // MdLockOpen,
  // MdLock,
} from 'react-icons/md';
import { DiTerminal } from 'react-icons/di';
import { AiTwotoneSetting, AiFillQuestionCircle } from 'react-icons/ai';
import { fetchInstantBalanceRequest } from '../WalletPage/reducer';
import SyncStatus from '../SyncStatus';
import {
  getAmountInSelectedUnit,
  // isWalletEncrypted,
} from '../../utils/utility';
import {
  BLOCKCHAIN_BASE_PATH,
  CONSOLE_RPC_CALL_BASE_PATH,
  WALLET_PAGE_PATH,
  WALLET_BASE_PATH,
  MASTER_NODES_PATH,
  // EXCHANGE_PATH,
  // HELP_PATH,
  SETTING_PATH,
  SITE_URL,
  TOKENS_PATH,
  SWAP_PATH,
  WALLET_TOKENS_PATH,
  LIQUIDITY_PATH,
  HELP_PATH,
} from '../../constants';
import styles from './Sidebar.module.scss';
import OpenNewTab from '../../utils/openNewTab';
import { updateBalanceScheduler } from '../../worker/schedular';
import usePrevious from '../../components/UsePrevious';
import {
  openEncryptWalletModal,
  openWalletPassphraseModal,
  lockWalletStart,
} from '../PopOver/reducer';

export interface SidebarProps extends RouteComponentProps {
  fetchInstantBalanceRequest: () => void;
  walletBalance: string;
  unit: string;
  isErrorModalOpen: boolean;
  blockChainInfo: any;
  isWalletUnlocked: boolean;
  isLoadingRemovePoolLiquidity: boolean;
  openEncryptWalletModal: () => void;
  openWalletPassphraseModal: () => void;
  lockWalletStart: () => void;
}

const Sidebar: React.FunctionComponent<SidebarProps> = (props) => {
  const prevIsErrorModalOpen = usePrevious(props.isErrorModalOpen);
  const [blur, setBlur] = useState(true);
  const { blockChainInfo } = props;

  useEffect(() => {
    props.fetchInstantBalanceRequest();
    const clearWalletBalanceTimer = updateBalanceScheduler();
    return () => {
      clearWalletBalanceTimer();
    };
  }, []);

  useEffect(() => {
    if (!props.isErrorModalOpen && prevIsErrorModalOpen) {
      props.fetchInstantBalanceRequest();
    }
  }, [prevIsErrorModalOpen, props.isErrorModalOpen]);

  const {
    openEncryptWalletModal,
    openWalletPassphraseModal,
    isWalletUnlocked,
    lockWalletStart,
    isLoadingRemovePoolLiquidity,
  } = props;

  useEffect(() => {
    setBlur(!blur);
  }, [isLoadingRemovePoolLiquidity]);

  const chainName = !isEmpty(blockChainInfo)
    ? blockChainInfo.chain.charAt(0).toUpperCase() +
      blockChainInfo.chain.slice(1)
    : '';

  return (
    <div className={`${styles.sidebar} ${blur && styles.blur}`}>
      {/* NOTE: Do not remove, for future purpose */}
      {/* <div className='text-right m-2'>
        {!isWalletEncrypted() ? (
          <MdLockOpen
            className={styles.iconPointer}
            size={25}
            onClick={openEncryptWalletModal}
          />
        ) : isWalletUnlocked ? (
          <MdLockOpen
            className={styles.iconPointer}
            size={25}
            onClick={lockWalletStart}
          />
        ) : (
          <MdLock
            className={styles.iconPointer}
            size={25}
            onClick={openWalletPassphraseModal}
          />
        )}
      </div> */}
      <div className={styles.currentNetwork}>
        <div className={styles.currentNetworkHeading}>
          {I18n.t('components.syncStatus.network')}
        </div>
        <div className={styles.currentNetworkValue}>{chainName}</div>
      </div>
      <div className={styles.navs}>
        <Nav className={`${styles.navMain} flex-column nav-pills`}>
          <NavItem className={styles.navItem}>
            <NavLink
              to={WALLET_TOKENS_PATH}
              exact
              tag={RRNavLink}
              className={styles.navLink}
              activeClassName={styles.active}
              isActive={(_match: any, location: { pathname: string }) => {
                return (
                  location.pathname.startsWith(WALLET_BASE_PATH) ||
                  location.pathname === WALLET_PAGE_PATH
                );
              }}
            >
              <MdAccountBalanceWallet />
              {I18n.t('containers.sideBar.wallets')}
            </NavLink>
          </NavItem>
          <NavItem className={styles.navItem}>
            <NavLink
              to={LIQUIDITY_PATH}
              tag={RRNavLink}
              className={styles.navLink}
              activeClassName={styles.active}
            >
              <MdPieChart />
              {I18n.t('containers.sideBar.liquidity')}
            </NavLink>
          </NavItem>

          <NavItem className={styles.navItem}>
            <NavLink
              to={SWAP_PATH}
              tag={RRNavLink}
              className={styles.navLink}
              activeClassName={styles.active}
            >
              <MdCompareArrows />
              {I18n.t('containers.sideBar.dex')}
            </NavLink>
          </NavItem>
          <NavItem className={styles.navItem}>
            <NavLink
              to={TOKENS_PATH}
              tag={RRNavLink}
              className={styles.navLink}
              activeClassName={styles.active}
            >
              <MdToll />
              {I18n.t('containers.sideBar.tokens')}
            </NavLink>
          </NavItem>
          <NavItem className={styles.navItem}>
            <NavLink
              to={BLOCKCHAIN_BASE_PATH}
              tag={RRNavLink}
              className={styles.navLink}
              activeClassName={styles.active}
            >
              <MdViewWeek />
              {I18n.t('containers.sideBar.blockchain')}
            </NavLink>
          </NavItem>
          <NavItem className={styles.navItem}>
            <NavLink
              to={MASTER_NODES_PATH}
              tag={RRNavLink}
              className={styles.navLink}
              activeClassName={styles.active}
            >
              <MdDns />
              {I18n.t('containers.sideBar.masterNodes')}
            </NavLink>
          </NavItem>
          {/* NOTE: Do not remove, for future purpose */}
          {/* <NavItem className={styles.navItem}>
            <NavLink
              to={EXCHANGE_PATH}
              tag={RRNavLink}
              className={styles.navLink}
              activeClassName={styles.active}
            >
              <MdCompareArrows />
              {I18n.t('containers.sideBar.exchange')}
            </NavLink>
          </NavItem> */}
        </Nav>
        <Nav className={`${styles.navSub} ${styles.navSubIcon}`}>
          <NavItem>
            <NavLink
              to={CONSOLE_RPC_CALL_BASE_PATH}
              tag={RRNavLink}
              className={styles.navLink}
              activeClassName={styles.active}
            >
              <DiTerminal />
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink
              to={HELP_PATH}
              tag={RRNavLink}
              className={styles.navLink}
              activeClassName={styles.active}
            >
              <AiFillQuestionCircle />
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink
              to={SETTING_PATH}
              tag={RRNavLink}
              className={styles.navLink}
              activeClassName={styles.active}
            >
              <AiTwotoneSetting />
            </NavLink>
          </NavItem>
        </Nav>
      </div>
      <SyncStatus />
    </div>
  );
};

const mapStateToProps = (state) => {
  const { i18n, wallet, settings, popover, swap } = state;
  return {
    locale: i18n.locale,
    unit: settings.appConfig.unit,
    walletBalance: wallet.walletBalance,
    isErrorModalOpen: popover.isOpen,
    blockChainInfo: wallet.blockChainInfo,
    isWalletUnlocked: popover.isWalletUnlocked,
    isLoadingRemovePoolLiquidity: swap.isLoadingRemovePoolLiquidity,
  };
};

const mapDispatchToProps = {
  fetchInstantBalanceRequest,
  openEncryptWalletModal,
  openWalletPassphraseModal,
  lockWalletStart: () => lockWalletStart({}),
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Sidebar)
);
