import React, { useEffect } from 'react';
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
  // MdCompareArrows,
  // MdLockOpen,
  // MdLock,
} from 'react-icons/md';
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
  WALLET_TOKENS_PATH,
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
  openEncryptWalletModal: () => void;
  openWalletPassphraseModal: () => void;
  lockWalletStart: () => void;
}

const Sidebar: React.FunctionComponent<SidebarProps> = (props) => {
  const prevIsErrorModalOpen = usePrevious(props.isErrorModalOpen);

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
  } = props;

  return (
    <div className={styles.sidebar}>
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
      <div className={styles.balance}>
        <div className={styles.balanceLabel}>
          {I18n.t('containers.sideBar.balance')}
        </div>
        <div className={styles.balanceValue}>
          {getAmountInSelectedUnit(props.walletBalance, props.unit)}
          &nbsp;
          {props.unit}
        </div>
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
              {I18n.t('containers.sideBar.wallet')}
            </NavLink>
          </NavItem>
          {/* NOTE: Do not remove, for future purpose */}
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
                to={TOKENS_PATH}
                tag={RRNavLink}
                className={styles.navLink}
                activeClassName={styles.active}
              >
                <MdToll />
                {I18n.t('containers.sideBar.tokens')}
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
        <Nav className={`${styles.navSub} flex-column nav-pills`}>
          <NavItem className={styles.navItem}>
            <NavLink
              to={CONSOLE_RPC_CALL_BASE_PATH}
              tag={RRNavLink}
              className={styles.navLink}
              activeClassName={styles.active}
            >
              {I18n.t('containers.sideBar.console')}
            </NavLink>
          </NavItem>
          <NavItem className={styles.navItem}>
            <NavLink
              onClick={() => OpenNewTab(SITE_URL)}
              className={styles.navLink}
              activeClassName={styles.active}
            >
              {I18n.t('containers.sideBar.help')}
            </NavLink>
          </NavItem>
          <NavItem className={styles.navItem}>
            <NavLink
              to={SETTING_PATH}
              tag={RRNavLink}
              className={styles.navLink}
              activeClassName={styles.active}
            >
              {I18n.t('containers.sideBar.settings')}
            </NavLink>
          </NavItem>
        </Nav>
      </div>
      <SyncStatus />
    </div>
  );
};

const mapStateToProps = (state) => {
  const { i18n, wallet, settings, popover } = state;
  return {
    locale: i18n.locale,
    unit: settings.appConfig.unit,
    walletBalance: wallet.walletBalance,
    isErrorModalOpen: popover.isOpen,
    blockChainInfo: wallet.blockChainInfo,
    isWalletUnlocked: popover.isWalletUnlocked,
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
