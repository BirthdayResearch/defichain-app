import React, { useEffect, useState } from 'react';
import { Card, Table, CardBody } from 'reactstrap';
import { connect } from 'react-redux';
import styles from './MasternodesList.module.scss';
import { I18n } from 'react-redux-i18n';
import { fetchMasternodesRequest } from '../../reducer';
import { filterByValue } from '../../../../utils/utility';
import {
  MASTER_NODES_PATH,
  MASTERNODE_LIST_PAGE_SIZE,
  RESIGNED_STATE,
} from '../../../../constants';
import { MasterNodeObject } from '../../masterNodeInterface';
import { Link } from 'react-router-dom';
import Pagination from '../../../../components/Pagination';
import { History } from 'history';
import cloneDeep from 'lodash/cloneDeep';

interface MasternodesListProps {
  masternodes: MasterNodeObject[];
  searchQuery: string;
  history: History;
  fetchMasternodesRequest: () => void;
}

const MasternodesList: React.FunctionComponent<MasternodesListProps> = (
  props: MasternodesListProps
) => {
  const defaultPage = 1;
  const { masternodes, fetchMasternodesRequest, searchQuery } = props;
  const [tableData, settableData] = useState<MasterNodeObject[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(defaultPage);
  const [enabledMasternodes, setEnabledMasternodes] = useState<
    MasterNodeObject[]
  >([]);

  useEffect(() => {
    fetchMasternodesRequest();
  }, []);

  useEffect(() => {
    if (masternodes.length > 0) {
      const enabledMasternodes = masternodes.filter(
        (masternode) => masternode.state !== RESIGNED_STATE
      );
      setEnabledMasternodes(enabledMasternodes);
    }
  }, [masternodes]);

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

  return (
    <>
      {tableData.length ? (
        <>
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
        </>
      ) : (
        <Card className='table-responsive-md'>
          <CardBody>
            {I18n.t('containers.masterNodes.masterNodesList.noMasterNodes')}
          </CardBody>
        </Card>
      )}
    </>
  );
};

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

const mapDispatchToProps = {
  fetchMasternodesRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(MasternodesList);
