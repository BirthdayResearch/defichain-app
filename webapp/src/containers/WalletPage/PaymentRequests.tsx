import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  Table,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { connect } from "react-redux";
import { MdMoreHoriz, MdDelete, MdAccessTime } from "react-icons/md";
import styles from "./PaymentRequests.module.scss";
import { I18n } from "react-redux-i18n";
import { fetchPaymentRequestsRequest } from "./reducer";
import {
  PaymentRequestsProps,
  PaymentRequestsState,
} from "./WalletPage.interface";

class PaymentRequests extends Component<
  PaymentRequestsProps,
  PaymentRequestsState
> {
  componentDidMount() {
    this.props.fetchPaymentRequests();
  }

  render() {
    return (
      <Card className="table-responsive-md mb-5">
        <Table className={styles.table}>
          <thead>
            <tr>
              <th></th>
              <th>{I18n.t("containers.wallet.paymentRequests.time")}</th>
              <th className={styles.amount}>
                {I18n.t("containers.wallet.paymentRequests.amount")}
              </th>
              <th>{I18n.t("containers.wallet.paymentRequests.message")}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.props.paymentRequests.map((request) => (
              <tr key={request.id}>
                <td className={styles.icon}>
                  <MdAccessTime className={styles.icon} />
                </td>
                <td>
                  <div className={styles.time}>
                    <Link to={`/wallet/paymentrequest/${request.id}`}>
                      {request.time}
                    </Link>
                  </div>
                </td>
                <td>
                  <div className={styles.amount}>
                    {request.amount}&nbsp;
                    <span className={styles.unit}>{request.unit}</span>
                  </div>
                </td>
                <td>
                  <div className={styles.message}>{request.message}</div>
                </td>
                <td className={styles.actionCell}>
                  <UncontrolledDropdown>
                    <DropdownToggle className="padless" color="link">
                      <MdMoreHoriz />
                    </DropdownToggle>
                    <DropdownMenu right>
                      <DropdownItem>
                        <MdDelete />
                        <span>
                          {I18n.t(
                            "containers.wallet.paymentRequests.cancelRequest"
                          )}
                        </span>
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    );
  }
}

const mapStateToProps = (state) => {
  const { paymentRequests } = state.wallet;
  return {
    paymentRequests,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchPaymentRequests: () => dispatch(fetchPaymentRequestsRequest()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PaymentRequests);
