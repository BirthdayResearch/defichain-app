import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Card, Table, CardBody } from 'reactstrap';
import styles from './BlockchainTable.module.scss';
import { I18n } from 'react-redux-i18n';
import { fetchBlocksRequest } from '../../reducer';
import { BLOCKCHAIN_BLOCK_BASE_PATH } from '../../../../constants';
import { BLOCK_PAGE_SIZE } from '../../../../constants/configs';
import Pagination from '../../../../components/Pagination';

interface BlockchainTableProps {
  blocks: {
    height: number;
    time: string;
    nTxns: string;
    size: string;
  }[];
  blockCount: number;
  isLoadingBlocks: boolean;
  isBlocksLoaded: boolean;
  blocksLoadError: string;
  fetchBlocks: (currentPage: number, pageSize: number) => void;
}

const BlockchainTable: React.FunctionComponent<BlockchainTableProps> = (
  props: BlockchainTableProps
) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = BLOCK_PAGE_SIZE;

  const { blockCount: total } = props;
  const pagesCount = Math.ceil(total / pageSize);
  const to = total - (currentPage - 1) * pageSize;
  const from = Math.max(to - pageSize, 0);

  useEffect(() => {
    props.fetchBlocks(currentPage, pageSize);
  }, []);

  const fetchData = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    props.fetchBlocks(pageNumber, pageSize);
  };

  if (props.isLoadingBlocks) {
    return (
      <div>{I18n.t('containers.blockChainPage.blockChainTable.loading')}</div>
    );
  }

  return (
    <>
      {total ? (
        <>
          <Card className={styles.card}>
            <div className={`${styles.tableResponsive} table-responsive-xl`}>
              <Table className={styles.table}>
                <thead>
                  <tr>
                    <th>
                      {I18n.t(
                        'containers.blockChainPage.blockChainTable.height'
                      )}
                    </th>
                    <th>
                      {I18n.t('containers.blockChainPage.blockChainTable.age')}
                    </th>
                    <th>
                      {I18n.t(
                        'containers.blockChainPage.blockChainTable.transactions'
                      )}
                    </th>
                    <th>
                      {I18n.t('containers.blockChainPage.blockChainTable.size')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {props.blocks.map(block => (
                    <tr key={block.height}>
                      <td>
                        <Link
                          to={`${BLOCKCHAIN_BLOCK_BASE_PATH}/${block.height}`}
                        >
                          {block.height}
                        </Link>
                      </td>
                      <td>
                        <div>{block.time}</div>
                      </td>
                      <td>
                        <div>{block.nTxns}</div>
                      </td>
                      <td>
                        <div>{block.size}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card>
          <Pagination
            label={I18n.t(
              'containers.blockChainPage.blockChainTable.paginationRange',
              {
                to,
                total,
                from: from + 1,
              }
            )}
            currentPage={currentPage}
            pagesCount={pagesCount}
            handlePageClick={fetchData}
          />
        </>
      ) : (
        <Card className='table-responsive-md'>
          <CardBody>
            {I18n.t('containers.blockChainPage.blockChainTable.noBlocks')}
          </CardBody>
        </Card>
      )}
    </>
  );
};

const mapStateToProps = state => {
  const {
    blocks,
    blockCount,
    isBlocksLoaded,
    isLoadingBlocks,
    blocksLoadError,
  } = state.blockchain;
  return {
    blocks,
    blockCount,
    isBlocksLoaded,
    isLoadingBlocks,
    blocksLoadError,
  };
};

const mapDispatchToProps = {
  fetchBlocks: (currentPage, pageSize) =>
    fetchBlocksRequest({ currentPage, pageSize }),
};

export default connect(mapStateToProps, mapDispatchToProps)(BlockchainTable);
