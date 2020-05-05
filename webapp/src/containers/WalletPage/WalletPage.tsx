import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { Button, ButtonGroup, Row, Col } from "reactstrap";
import { MdArrowUpward, MdArrowDownward } from "react-icons/md";
import { NavLink as RRNavLink } from "react-router-dom";
import StatCard from "../../components/StatCard/StatCard";
import WalletTxns from "./WalletTxns";
import PaymentRequests from "./PaymentRequests";
import { I18n } from "react-redux-i18n";
import { connect } from "react-redux";
import { fetchWalletBalanceRequest } from "./reducer";

interface WalletPageProps {
  walletBalance: string;
  fetchWalletBalance: Function;
}

interface WalletPageState {
  activeTab: string;
}

class WalletPage extends Component<WalletPageProps, WalletPageState> {
  state = {
    activeTab: "txns",
  };

  componentDidMount() {
    this.props.fetchWalletBalance();
  }

  setActiveTab = (tab: string) => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  };

  render() {
    const { walletBalance } = this.props;
    return (
      <div className="main-wrapper">
        <Helmet>
          <title>
            {I18n.t("containers.wallet.walletPage.walletDefiClient")}
          </title>
        </Helmet>
        <header className="header-bar">
          <h1>{I18n.t("containers.wallet.walletPage.wallet")}</h1>
          <ButtonGroup>
            <Button to="/wallet/send" tag={RRNavLink} color="link" size="sm">
              <MdArrowUpward />
              <span className="d-md-inline">
                {I18n.t("containers.wallet.walletPage.send")}
              </span>
            </Button>
            <Button to="/wallet/receive" tag={RRNavLink} color="link" size="sm">
              <MdArrowDownward />
              <span className="d-md-inline">
                {I18n.t("containers.wallet.walletPage.receive")}
              </span>
            </Button>
          </ButtonGroup>
        </header>
        <div className="content">
          <section>
            <Row>
              <Col>
                <StatCard
                  label={I18n.t(
                    "containers.wallet.walletPage.availableBalance"
                  )}
                  value={walletBalance}
                  unit="DFI"
                />
              </Col>
              <Col>
                <StatCard
                  label={I18n.t("containers.wallet.walletPage.pending")}
                  value="1,000"
                  unit="DFI"
                />
              </Col>
            </Row>
          </section>
          <section>
            <h2>{I18n.t("containers.wallet.walletPage.paymentRequests")}</h2>
            <PaymentRequests />
          </section>
          <section>
            <h2>{I18n.t("containers.wallet.walletPage.transactions")}</h2>
            <WalletTxns />
          </section>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { walletBalance } = state.wallet;
  return {
    walletBalance,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchWalletBalance: () => dispatch(fetchWalletBalanceRequest()),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(WalletPage);
