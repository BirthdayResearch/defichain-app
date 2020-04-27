import React, { Component } from "react";
import { Card, Table } from "reactstrap";
import { connect } from "react-redux";
import { MdArrowUpward, MdArrowDownward } from "react-icons/md";
import styles from "./WalletTxns.module.scss";
import { WalletTxnsProps, WalletTxnsState } from "./WalletPage.interface";
import { I18n } from "react-redux-i18n";
import { fetchWalletTxnsRequest } from "./reducer";

class WalletTxns extends Component<WalletTxnsProps, WalletTxnsState> {
  componentDidMount() {
    this.props.fetchWalletTxns();
  }

  TxnTypeIcon = (type) => {
    let Icon;
    if (type === "Received") {
      Icon = MdArrowDownward;
    } else {
      Icon = MdArrowUpward;
    }

    return <Icon className={styles.typeIcon} />;
  };

  render() {
    return (
      <Card className="table-responsive-md">
        <Table className={styles.table}>
          <thead>
            <tr>
              <th></th>
              <th>{I18n.t("containers.wallet.walletTxns.time")}</th>
              <th className={styles.amount}>
                {I18n.t("containers.wallet.walletTxns.amount")}
              </th>
              <th>{I18n.t("containers.wallet.walletTxns.hash")}</th>
            </tr>
          </thead>
          <tbody>
            {this.props.walletTxns.map((txn) => (
              <tr key={txn.id}>
                <td className={styles.typeIcon}>
                  {this.TxnTypeIcon(txn.type)}
                </td>
                <td>
                  <div className={styles.time}>{txn.time}</div>
                </td>
                <td>
                  <div className={styles.amount}>
                    {txn.amount} <span className={styles.unit}>{txn.unit}</span>
                  </div>
                </td>
                <td>
                  <div className={styles.hash}>{txn.hash}</div>
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
  const { walletTxns } = state.wallet;
  return {
    walletTxns,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchWalletTxns: () => dispatch(fetchWalletTxnsRequest()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WalletTxns);
