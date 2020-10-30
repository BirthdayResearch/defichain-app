// Not in use component. Don't delete it for future purposes

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import { History } from 'history';
import { Card, Table, CardBody } from 'reactstrap';

import cloneDeep from 'lodash/cloneDeep';
import EllipsisText from 'react-ellipsis-text';

import styles from './TransfersList.module.scss';
import Pagination from '../../../../../components/Pagination';
import { fetchTransfersRequest } from '../../../reducer';
import { TransferObject } from '../../../tokenInfoInterface';
import {
  MASTER_NODES_PATH,
  TOKEN_TRANSFERS_LIST_PAGE_SIZE,
} from '../../../../../constants';

interface TransfersListProps {
  transfers: TransferObject[];
  history: History;
  fetchTransfers: (symbol: string | undefined) => void;
  symbol: string | undefined;
}

const TransfersList: React.FunctionComponent<TransfersListProps> = (
  props: TransfersListProps
) => {
  const defaultPage = 1;
  const { transfers, fetchTransfers, symbol } = props;
  const [tableData, settableData] = useState<TransferObject[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(defaultPage);
  useEffect(() => {
    fetchTransfers(symbol);
  }, []);
  const pageSize = TOKEN_TRANSFERS_LIST_PAGE_SIZE;
  const total = transfers.length;
  const pagesCount = Math.ceil(total / pageSize);
  const from = (currentPage - 1) * pageSize;
  const to = Math.min(total, currentPage * pageSize);

  function paginate(pageNumber, transfersList?: TransferObject[]) {
    const clone = cloneDeep(transfersList || transfers);
    const tableData = clone.slice(
      (pageNumber - 1) * pageSize,
      pageNumber * pageSize
    );
    setCurrentPage(pageNumber);
    settableData(tableData);
  }

  useEffect(() => {
    paginate(defaultPage, transfers);
  }, [transfers]);

  return (
    <>
      {tableData.length ? (
        <>
          <Card className={styles.card}>
            <div className={`${styles.tableResponsive} table-responsive-xl`}>
              <Table className={styles.table}>
                <thead>
                  <tr>
                    <th>{I18n.t('containers.tokens.transfersList.txnHash')}</th>
                    <th>{I18n.t('containers.tokens.transfersList.age')}</th>
                    <th>{I18n.t('containers.tokens.transfersList.from')}</th>
                    <th>{I18n.t('containers.tokens.transfersList.to')}</th>
                    <th>{I18n.t('containers.tokens.transfersList.amount')}</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((masternode) => (
                    <tr key={masternode.txnhash}>
                      <td>
                        <Link
                          className={styles.address}
                          to={`${MASTER_NODES_PATH}/${masternode.txnhash}`}
                        >
                          <EllipsisText
                            text={masternode.txnhash}
                            length={'20'}
                          />
                        </Link>
                      </td>
                      <td>
                        <div className={styles.pose}>{masternode.age}</div>
                      </td>
                      <td>
                        <Link
                          className={styles.address}
                          to={`${MASTER_NODES_PATH}/${masternode.from}`}
                        >
                          <EllipsisText text={masternode.from} length={'20'} />
                        </Link>
                      </td>
                      <td>
                        <Link
                          className={styles.address}
                          to={`${MASTER_NODES_PATH}/${masternode.to}`}
                        >
                          <EllipsisText text={masternode.to} length={'20'} />
                        </Link>
                      </td>
                      <td>
                        <div className={styles.lastPaid}>
                          {masternode.amount}
                        </div>
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
  const { transfers } = state.tokens;
  return {
    transfers,
  };
};

const mapDispatchToProps = {
  fetchTransfers: (id) => fetchTransfersRequest({ id }),
};

export default connect(mapStateToProps, mapDispatchToProps)(TransfersList);
