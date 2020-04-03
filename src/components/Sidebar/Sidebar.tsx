import React, { Component } from "react";
import { Nav, NavItem, NavLink } from "reactstrap";
import {
  NavLink as RRNavLink,
  withRouter,
  RouteComponentProps
} from "react-router-dom";
import {
  MdAccountBalanceWallet,
  MdDns,
  MdViewWeek,
  MdCompareArrows
} from "react-icons/md";
import styles from "./Sidebar.module.scss";
import { SidebarProps, SidebarState } from "./Sidebar.interface";

class Sidebar extends Component<
  SidebarProps & RouteComponentProps,
  SidebarState
> {
  state = {
    balance: {
      available: "1,000"
    }
  };

  render() {
    return (
      <div className={styles.sidebar}>
        <div className={styles.balance}>
          <div className={styles.balanceLabel}>Balance</div>
          <div className={styles.balanceValue}>
            {this.state.balance.available} DFI
          </div>
        </div>
        <div className={styles.navs}>
          <Nav className={`${styles.navMain} flex-column nav-pills`}>
            <NavItem className={styles.navItem}>
              <NavLink
                to="/"
                exact
                tag={RRNavLink}
                className={styles.navLink}
                activeClassName={styles.active}
                isActive={(match, location) => {
                  return (
                    location.pathname.startsWith("/wallet") ||
                    location.pathname === "/"
                  );
                }}
              >
                <MdAccountBalanceWallet />
                Wallet
              </NavLink>
            </NavItem>
            <NavItem className={styles.navItem}>
              <NavLink
                to="/masternodes"
                tag={RRNavLink}
                className={styles.navLink}
                activeClassName={styles.active}
              >
                <MdDns />
                Masternodes
              </NavLink>
            </NavItem>
            <NavItem className={styles.navItem}>
              <NavLink
                to="/blockchain"
                tag={RRNavLink}
                className={styles.navLink}
                activeClassName={styles.active}
              >
                <MdViewWeek />
                Blockchain
              </NavLink>
            </NavItem>
            <NavItem className={styles.navItem}>
              <NavLink
                to="/exchange"
                tag={RRNavLink}
                className={styles.navLink}
                activeClassName={styles.active}
              >
                <MdCompareArrows />
                Exchange
              </NavLink>
            </NavItem>
          </Nav>
          <Nav className={`${styles.navSub} flex-column nav-pills`}>
            <NavItem className={styles.navItem}>
              <NavLink
                to="/help"
                tag={RRNavLink}
                className={styles.navLink}
                activeClassName={styles.active}
              >
                Help
              </NavLink>
            </NavItem>
            <NavItem className={styles.navItem}>
              <NavLink
                to="/settings"
                tag={RRNavLink}
                className={styles.navLink}
                activeClassName={styles.active}
              >
                Settings
              </NavLink>
            </NavItem>
          </Nav>
        </div>
      </div>
    );
  }
}

export default withRouter(Sidebar);
