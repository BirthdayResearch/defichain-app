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
  MdSettings,
  MdHelp,
  MdExitToApp,
  MdLockOutline,
  MdLockOpen,
} from 'react-icons/md';
import { HiTerminal } from 'react-icons/hi';
import {
  fetchInstantBalanceRequest,
  lockWalletStart,
} from '../WalletPage/reducer';
import SyncStatus from '../SyncStatus';
import {
  BLOCKCHAIN_BASE_PATH,
  CONSOLE_RPC_CALL_BASE_PATH,
  WALLET_PAGE_PATH,
  WALLET_BASE_PATH,
  MASTER_NODES_PATH,
  TOKENS_PATH,
  SWAP_PATH,
  WALLET_TOKENS_PATH,
  LIQUIDITY_PATH,
  HELP_PATH,
  SETTING_PATH,
  PACKAGE_VERSION,
} from '../../constants';
import styles from './Sidebar.module.scss';
import { updateBalanceScheduler } from '../../worker/schedular';
import usePrevious from '../../components/UsePrevious';
import {
  openEncryptWalletModal,
  openWalletPassphraseModal,
  openExitWalletModal,
  openMasternodeWarningModal,
} from '../PopOver/reducer';
import { MasterNodeObject } from '../MasternodesPage/masterNodeInterface';
import { hasAnyMasternodeEnabled } from '../MasternodesPage/service';

export interface SidebarProps extends RouteComponentProps {
  fetchInstantBalanceRequest: () => void;
  walletBalance: string;
  unit: string;
  isErrorModalOpen: boolean;
  blockChainInfo: any;
  isWalletUnlocked: boolean;
  isLoadingRemovePoolLiquidity: boolean;
  isLoadingAddPoolLiquidity: boolean;
  isLoadingPoolSwap: boolean;
  openEncryptWalletModal: () => void;
  openWalletPassphraseModal: () => void;
  lockWalletStart: () => void;
  isWalletCreatedFlag: boolean;
  openExitWalletModal: (t: boolean) => void;
  isWalletEncrypted: boolean;
  myMasternodes: MasterNodeObject[];
  openMasternodeWarningModal: (t: boolean) => void;
}

const Sidebar: React.FunctionComponent<SidebarProps> = (props) => {
  const prevIsErrorModalOpen = usePrevious(props.isErrorModalOpen);
  const [blur, setBlur] = useState(true);

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
    isLoadingAddPoolLiquidity,
    isLoadingPoolSwap,
    isWalletCreatedFlag,
    openExitWalletModal,
    blockChainInfo,
    isWalletEncrypted,
    myMasternodes,
    openMasternodeWarningModal,
  } = props;

  useEffect(() => {
    setBlur(!blur);
  }, [
    isLoadingRemovePoolLiquidity,
    isLoadingAddPoolLiquidity,
    isLoadingPoolSwap,
  ]);

  const chainName = !isEmpty(blockChainInfo)
    ? blockChainInfo.chain.charAt(0).toUpperCase() +
      blockChainInfo.chain.slice(1)
    : '';

  const ICON_SIZE = 25;

  const onLockWallet = () => {
    hasAnyMasternodeEnabled(myMasternodes)
      ? openMasternodeWarningModal(true)
      : lockWalletStart();
  };

  return (
    <div className={`${styles.sidebar} ${blur && styles.blur}`} disabled={blur}>
      <div className={`text-right m-2 mr-3 ${styles.iconSideBar}`}>
        {isWalletCreatedFlag && (
          <>
            {!isWalletEncrypted ? (
              <MdLockOpen
                className={`${styles.iconNavTop}`}
                size={ICON_SIZE}
                onClick={openEncryptWalletModal}
              />
            ) : isWalletUnlocked ? (
              <MdLockOpen
                className={`${styles.iconNavTop}`}
                size={ICON_SIZE}
                onClick={onLockWallet}
              />
            ) : (
              <MdLockOutline
                className={`${styles.iconNavTop} ${styles.navBadgeLocked}`}
                size={ICON_SIZE}
                onClick={openWalletPassphraseModal}
              />
            )}
            <MdExitToApp
              onClick={() => openExitWalletModal(true)}
              className={`ml-2 ${styles.flipX} ${styles.iconNavTop}`}
              size={ICON_SIZE}
            />
          </>
        )}
      </div>
      <div className={styles.currentNetwork}>
        <div className={styles.currentNetworkHeading}>
          {I18n.t('components.syncStatus.network')}
        </div>
        <div className={styles.currentNetworkValue}>
          <div>{chainName}</div>
          <div className='ml-auto'>{PACKAGE_VERSION}</div>
        </div>
      </div>
      <div className={styles.navs}>
        {!isWalletCreatedFlag ? (
          <Nav className={`align-items-center flex-grow-1`}>
            <NavItem>
              <NavLink
                className={`d-flex align-items-center justify-content-center flex-column p-0`}
                to={WALLET_TOKENS_PATH}
                exact
                tag={RRNavLink}
              >
                <div className={`${styles.navBadgeIcon} rounded-circle`}>
                  <MdAccountBalanceWallet />
                </div>
                <div className={`${styles.navBadgeText}`}>
                  {I18n.t('containers.sideBar.selectCreateRestore')}
                </div>
              </NavLink>
            </NavItem>
          </Nav>
        ) : (
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
                {I18n.t('containers.sideBar.balances')}
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
                {hasAnyMasternodeEnabled(myMasternodes) && (
                  <div className={styles.iconPosition}>
                    <span className={`txn-status-enabled mt-1 ml-1`}></span>
                  </div>
                )}
              </NavLink>
            </NavItem>
          </Nav>
        )}
        <Nav className={`${styles.navSub} ${styles.navSubIcon}`}>
          <NavItem>
            <NavLink
              to={CONSOLE_RPC_CALL_BASE_PATH}
              tag={RRNavLink}
              className={styles.navLink}
              activeClassName={styles.active}
            >
              <HiTerminal />
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink
              to={HELP_PATH}
              tag={RRNavLink}
              className={styles.navLink}
              activeClassName={styles.active}
            >
              <MdHelp />
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink
              to={SETTING_PATH}
              tag={RRNavLink}
              className={styles.navLink}
              activeClassName={styles.active}
            >
              <MdSettings />
            </NavLink>
          </NavItem>
        </Nav>
      </div>
      <SyncStatus />
    </div>
  );
};

const mapStateToProps = (state) => {
  const { i18n, wallet, settings, popover, swap, masterNodes } = state;
  return {
    locale: i18n.locale,
    unit: settings.appConfig.unit,
    walletBalance: wallet.walletBalance,
    isErrorModalOpen: popover.isOpen,
    blockChainInfo: wallet.blockChainInfo,
    isWalletUnlocked: wallet.isWalletUnlocked,
    isLoadingRemovePoolLiquidity: swap.isLoadingRemovePoolLiquidity,
    isLoadingAddPoolLiquidity: swap.isLoadingAddPoolLiquidity,
    isLoadingPoolSwap: swap.isLoadingPoolSwap,
    isWalletCreatedFlag: wallet.isWalletCreatedFlag,
    isWalletEncrypted: wallet.isWalletEncrypted,
    myMasternodes: masterNodes.myMasternodes,
  };
};

const mapDispatchToProps = {
  fetchInstantBalanceRequest,
  openEncryptWalletModal,
  openWalletPassphraseModal,
  lockWalletStart,
  openExitWalletModal,
  openMasternodeWarningModal,
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Sidebar)
);
