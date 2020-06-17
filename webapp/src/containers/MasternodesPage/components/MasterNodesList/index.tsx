import React, { Component } from 'react';
import { Card, Table } from 'reactstrap';
import { connect } from 'react-redux';
import styles from './MasternodesList.module.scss';
import { I18n } from 'react-redux-i18n';
import { fetchMasternodesRequest } from '../../reducer';
import { filterByValue } from '../../../../utils/utility';
import { History } from 'history';
import { MASTER_NODES_PATH } from '../../../../constants';
import { MasterNodeObject } from '../../masterNodeInterface';

interface MasternodesListProps {
  masternodes: MasterNodeObject[];
  searchQuery: string;
  history: History;
  fetchMasternodesRequest: () => void;
}

interface MasternodesListState {
  masternodes: MasterNodeObject[];
}

class MasternodesList extends Component<
  MasternodesListProps,
  MasternodesListState
> {
  componentDidMount() {
    this.props.fetchMasternodesRequest();
  }
  render() {
    const { history } = this.props;
    let tableData: MasterNodeObject[] = [];
    if (!this.props.searchQuery) {
      tableData = this.props.masternodes;
    } else {
      tableData = filterByValue(this.props.masternodes, this.props.searchQuery);
    }
    return (
      <Card className={styles.card}>
        <div className={`${styles.tableResponsive} table-responsive-xl`}>
          <Table className={styles.table}>
            <thead>
              <tr>
                <th></th>
                <th>
                  {I18n.t(
                    'containers.masterNodes.masterNodesList.ownerAddress'
                  )}
                </th>
                <th>
                  {I18n.t(
                    'containers.masterNodes.masterNodesList.operatorAddress'
                  )}
                </th>
                <th>
                  {I18n.t('containers.masterNodes.masterNodesList.registered')}
                </th>
                <th>
                  {I18n.t(
                    'containers.masterNodes.masterNodesList.mintedBlocks'
                  )}
                </th>
              </tr>
            </thead>
            <tbody>
              {tableData.map(masternode => (
                <tr
                  key={masternode.hash}
                  onClick={() =>
                    history.push(`${MASTER_NODES_PATH}/${masternode.hash}`)
                  }
                >
                  <td className={styles.status}>
                    <span
                      className={`txn-status-${masternode.state.toLowerCase()}`}
                    >
                      {masternode.state}
                    </span>
                  </td>
                  <td>
                    <div className={styles.address}>
                      {masternode.ownerAuthAddress}
                    </div>
                  </td>
                  <td>
                    <div className={styles.pose}>
                      {masternode.operatorAuthAddress}
                    </div>
                  </td>
                  <td>
                    <div className={styles.registered}>
                      {masternode.creationHeight}
                    </div>
                  </td>
                  <td>
                    <div className={styles.lastPaid}>
                      {masternode.mintedBlocks}
                    </div>
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

const mapStateToProps = state => {
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

const mapDispatchToProps = {
  fetchMasternodesRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(MasternodesList);
