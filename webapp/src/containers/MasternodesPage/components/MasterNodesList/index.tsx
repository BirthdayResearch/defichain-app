import React, { useEffect, useState } from 'react';
import { Card, Table, CardBody, TabPane } from 'reactstrap';
import styles from './MasternodesList.module.scss';
import { I18n } from 'react-redux-i18n';
import { filterByValue } from '../../../../utils/utility';
import {
  MASTER_NODES_PATH,
  MASTERNODE_LIST_PAGE_SIZE,
  ALL,
} from '../../../../constants';
import { MasterNodeObject } from '../../masterNodeInterface';
import { Link } from 'react-router-dom';
import Pagination from '../../../../components/Pagination';
import cloneDeep from 'lodash/cloneDeep';
import { connect } from 'react-redux';

interface MasternodesListProps {
  searchQuery: string;
  enabledMasternodes: MasterNodeObject[];
  isLoadingMasternodes: boolean;
}

const MasternodesList: React.FunctionComponent<MasternodesListProps> = (
  props: MasternodesListProps
) => {
  const defaultPage = 1;
  const { searchQuery, enabledMasternodes, isLoadingMasternodes } = props;
  const [tableData, settableData] = useState<MasterNodeObject[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(defaultPage);

  const pageSize = MASTERNODE_LIST_PAGE_SIZE;
  const total = enabledMasternodes.length;
  const pagesCount = Math.ceil(total / pageSize);
  const from = (currentPage - 1) * pageSize;
  const to = Math.min(total, currentPage * pageSize);

  function paginate(pageNumber, masternodeList?: MasterNodeObject[]) {
    const clone = cloneDeep(masternodeList || enabledMasternodes);
    const tableData = clone.slice(
      (pageNumber - 1) * pageSize,
      pageNumber * pageSize
    );

    setCurrentPage(pageNumber);
    settableData(tableData);
  }

  useEffect(() => {
    if (!searchQuery) {
      paginate(currentPage);
    } else {
      const masternodeList: MasterNodeObject[] = filterByValue(
        enabledMasternodes,
        searchQuery
      );
      paginate(defaultPage, masternodeList);
    }
  }, [enabledMasternodes, searchQuery]);

  const loadHtml = () => {
    if (!tableData.length) {
      return (
        <Card className='table-responsive-md'>
          <CardBody>
            {I18n.t('containers.masterNodes.masterNodesList.noMasterNodes')}
          </CardBody>
        </Card>
      );
    }
    return (
      <TabPane tabId={ALL}>
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
                    {I18n.t(
                      'containers.masterNodes.masterNodesList.registered'
                    )}
                  </th>
                  <th>
                    {I18n.t(
                      'containers.masterNodes.masterNodesList.mintedBlocks'
                    )}
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((masternode) => (
                  <tr key={masternode.hash} className={styles.masternodeRow}>
                    <td className={styles.status}>
                      <span
                        className={`txn-status-${masternode.state.toLowerCase()}`}
                      >
                        {masternode.state}
                      </span>
                    </td>
                    <td>
                      <Link
                        className={styles.address}
                        to={`${MASTER_NODES_PATH}/${masternode.hash}`}
                      >
                        {masternode.ownerAuthAddress}
                      </Link>
                    </td>
                    <td>
                      <div>{masternode.operatorAuthAddress}</div>
                    </td>
                    <td>
                      <div>{masternode.creationHeight}</div>
                    </td>
                    <td>
                      <div>{masternode.mintedBlocks}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>
        <Pagination
          label={I18n.t('containers.wallet.walletPage.paginationRange', {
            to,
            total,
            from: from + 1,
          })}
          currentPage={currentPage}
          pagesCount={pagesCount}
          handlePageClick={paginate}
        />
      </TabPane>
    );
  };

  return <>{loadHtml()}</>;
};

const mapStateToProps = (state) => {
  const {
    masterNodes: { isLoadingMasternodes },
  } = state;
  return {
    isLoadingMasternodes,
  };
};

export default connect(mapStateToProps)(MasternodesList);
