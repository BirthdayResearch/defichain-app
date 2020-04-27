import React, { Component } from "react";
import { Card, Table } from "reactstrap";
import { connect } from "react-redux";
import styles from "./MasternodesList.module.scss";
import {
  MasternodesListProps,
  MasternodesListState,
} from "./MasternodesPage.interface";
import { I18n } from "react-redux-i18n";
import { fetchMasternodesRequest } from "./reducer";

class MasternodesList extends Component<
  MasternodesListProps,
  MasternodesListState
> {
  componentDidMount() {
    this.props.fetchMasterNodes();
  }

  render() {
    return (
      <Card className={styles.card}>
        <div className={`${styles.tableResponsive} table-responsive-xl`}>
          <Table className={styles.table}>
            <thead>
              <tr>
                <th></th>
                <th>
                  {I18n.t("containers.masterNodes.masterNodesList.address")}
                </th>
                <th>
                  {I18n.t("containers.masterNodes.masterNodesList.poseSore")}
                </th>
                <th>
                  {I18n.t("containers.masterNodes.masterNodesList.registered")}
                </th>
                <th>
                  {I18n.t("containers.masterNodes.masterNodesList.lastPaid")}
                </th>
                <th>
                  {I18n.t("containers.masterNodes.masterNodesList.nextPayment")}
                </th>
                <th>
                  {I18n.t("containers.masterNodes.masterNodesList.payee")}
                </th>
              </tr>
            </thead>
            <tbody>
              {this.props.masternodes.map((masternode) => (
                <tr key={masternode.id}>
                  <td className={styles.status}>
                    <span className={`txn-status-${masternode.status}`}>
                      {masternode.status}
                    </span>
                  </td>
                  <td>
                    <div className={styles.address}>{masternode.address}</div>
                  </td>
                  <td>
                    <div className={styles.pose}>{masternode.pose}</div>
                  </td>
                  <td>
                    <div className={styles.registered}>
                      {masternode.registered}
                    </div>
                  </td>
                  <td>
                    <div className={styles.lastPaid}>{masternode.lastPaid}</div>
                  </td>
                  <td>
                    <div className={styles.nextPayment}>
                      {masternode.nextPayment}
                    </div>
                  </td>
                  <td>
                    <div className={styles.payee}>{masternode.payee}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    masternodes,
    isMasternodesLoaded,
    isLoadingMasternodes,
    masternodesLoadError,
  } = state.masterNodes;
  return {
    masternodes,
    isMasternodesLoaded,
    isLoadingMasternodes,
    masternodesLoadError,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchMasterNodes: () => dispatch(fetchMasternodesRequest()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MasternodesList);
