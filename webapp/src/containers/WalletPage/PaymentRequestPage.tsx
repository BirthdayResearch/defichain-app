import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { Button, ButtonGroup } from "reactstrap";
import { MdArrowBack, MdDelete } from "react-icons/md";
import { NavLink, RouteComponentProps } from "react-router-dom";
import KeyValueLi from "../../components/KeyValueLi/KeyValueLi";
import { I18n } from "react-redux-i18n";

interface PaymentRequestPageProps {}

interface PaymentRequestPageState {
  label: string;
  amount: string;
  time: string;
  message: string;
  address: string;
}

interface RouteProps {
  id: string;
}

class PaymentRequestPage extends Component<
  PaymentRequestPageProps & RouteComponentProps<RouteProps>,
  PaymentRequestPageState
> {
  state = {
    label: "TREQ 9876",
    amount: "1.5",
    time: "Feb 19, 2:03 pm",
    message: "Ref ID REQ456789",
    address: "bc1qnckyj0jxrcgtu4j90r0efcae750rfx6555rhaq",
  };

  render() {
    return (
      <div className="main-wrapper">
        <Helmet>
          <title>
            {I18n.t(
              "containers.wallet.paymentRequestPage.paymentRequestTitle",
              {
                id: this.props.match.params.id,
              }
            )}
          </title>
        </Helmet>
        <header className="header-bar">
          <Button to="/" tag={NavLink} color="link" className="header-bar-back">
            <MdArrowBack />
            <span className="d-lg-inline">
              {I18n.t("containers.wallet.paymentRequestPage.wallet")}
            </span>
          </Button>
          <h1>
            {I18n.t("containers.wallet.paymentRequestPage.paymentRequest")}
            &nbsp;
            {this.props.match.params.id}
          </h1>
          <ButtonGroup>
            <Button color="link">
              <MdDelete />
              <span>
                {I18n.t("containers.wallet.paymentRequestPage.delete")}
              </span>
            </Button>
          </ButtonGroup>
        </header>
        <div className="content">
          <section className="mb-5">
            <KeyValueLi
              label={I18n.t("containers.wallet.paymentRequestPage.label")}
              value={this.state.label}
            />
            <KeyValueLi
              label={I18n.t("containers.wallet.paymentRequestPage.amount")}
              value={this.state.amount}
            />
            <KeyValueLi
              label={I18n.t("containers.wallet.paymentRequestPage.time")}
              value={this.state.time}
            />
            <KeyValueLi
              label={I18n.t("containers.wallet.paymentRequestPage.message")}
              value={this.state.message}
            />
            <KeyValueLi
              label={I18n.t("containers.wallet.paymentRequestPage.address")}
              value={this.state.address}
              popsQR={true}
              copyable={true!}
              uid="address"
            />
            <KeyValueLi
              label={I18n.t("containers.wallet.paymentRequestPage.uRI")}
              value={`
              bitcoin:${this.state.address}?amount=${this.state.amount}&label=${this.state.label}&message=${this.state.message}
            `}
              popsQR={true}
              copyable={true}
              uid="uri"
            />
          </section>
        </div>
      </div>
    );
  }
}

export default PaymentRequestPage;
