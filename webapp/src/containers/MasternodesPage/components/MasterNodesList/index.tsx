import React, { Component } from 'react';
import { Card, Table } from 'reactstrap';
import { connect } from 'react-redux';
import styles from './MasternodesList.module.scss';
import { I18n } from 'react-redux-i18n';
import { fetchMasternodesRequest } from '../../reducer';
import { filterByValue } from '../../../../utils/utility';

interface MasternodesListProps {
  masternodes: {
    hash: string;
    ownerAuthAddress: string;
    operatorAuthAddress: string;
    creationHeight: number;
    resignHeight: number;
    resignTx: string;
    banHeight: number;
    banTx: string;
    state: string;
    mintedBlocks: number;
  }[];
  searchQuery: string;
  fetchMasternodesRequest: () => void;
}

interface MasterNodeObject {
  hash: string;
  ownerAuthAddress: string;
  operatorAuthAddress: string;
  creationHeight: number;
  resignHeight: number;
  resignTx: string;
  banHeight: number;
  banTx: string;
  state: string;
  mintedBlocks: number;
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
                <tr key={masternode.hash}>
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
