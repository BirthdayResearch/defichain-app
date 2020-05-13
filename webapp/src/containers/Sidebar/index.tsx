import React, { useEffect } from 'react';
import { Nav, NavItem, NavLink } from 'reactstrap';
import {
  NavLink as RRNavLink,
  withRouter,
  RouteComponentProps,
} from 'react-router-dom';
import { I18n } from 'react-redux-i18n';
import {
  MdAccountBalanceWallet,
  MdDns,
  MdViewWeek,
  MdCompareArrows,
} from 'react-icons/md';
import styles from './Sidebar.module.scss';
import { connect } from 'react-redux';
import { fetchWalletBalanceRequest } from '../WalletPage/reducer';
import SyncStatus from '../SyncStatus';
import {
  BLOCKCHAIN_BASE_PATH,
  WALLET_PAGE_PATH,
  WALLET_BASE_PATH,
  MASTER_NODES_PATH,
  EXCHANGE_PATH,
  HELP_PATH,
  SETTING_PATH,
} from '../../constants';

export interface SidebarProps extends RouteComponentProps {
  fetchWalletBalance: () => void;
  walletBalance: string;
}

const Sidebar: React.FunctionComponent<SidebarProps> = props => {
  useEffect(() => {
    props.fetchWalletBalance();
  }, []);

  return (
    <div className={styles.sidebar}>
      <div className={styles.balance}>
        <div className={styles.balanceLabel}>
          {I18n.t('containers.sideBar.balance')}
        </div>
        <div className={styles.balanceValue}>
          {props.walletBalance} {I18n.t('containers.sideBar.dfi')}
        </div>
      </div>
      <div className={styles.navs}>
        <Nav className={`${styles.navMain} flex-column nav-pills`}>
          <NavItem className={styles.navItem}>
            <NavLink
              to={WALLET_PAGE_PATH}
              exact
              tag={RRNavLink}
              className={styles.navLink}
              activeClassName={styles.active}
              isActive={(match, location) => {
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
              to={EXCHANGE_PATH}
              tag={RRNavLink}
              className={styles.navLink}
              activeClassName={styles.active}
            >
              <MdCompareArrows />
              {I18n.t('containers.sideBar.exchange')}
            </NavLink>
          </NavItem>
        </Nav>
        <Nav className={`${styles.navSub} flex-column nav-pills`}>
          <NavItem className={styles.navItem}>
            <NavLink
              to={HELP_PATH}
              tag={RRNavLink}
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

const mapStateToProps = ({ i18n, wallet }) => {
  const { locale } = i18n;
  return {
    locale,
    walletBalance: wallet.walletBalance,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchWalletBalance: () => dispatch(fetchWalletBalanceRequest()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Sidebar)
);
