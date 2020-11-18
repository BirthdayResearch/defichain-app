import React, { useEffect, useState } from 'react';
import { Card, Table, CardBody, Button } from 'reactstrap';
import styles from './AvailablePoolPairList.module.scss';
import { I18n } from 'react-redux-i18n';
import { filterByValue } from '../../../../utils/utility';
import { NavLink as RRNavLink } from 'react-router-dom';
import {
  MASTERNODE_LIST_PAGE_SIZE,
  CREATE_POOL_PAIR_PATH,
} from '../../../../constants';
import { Link } from 'react-router-dom';
// import Pagination from '../../../../components/Pagination';
import cloneDeep from 'lodash/cloneDeep';
import { connect } from 'react-redux';
import PairIcon from '../../../../components/PairIcon';
import { MdAdd } from 'react-icons/md';

interface AvailablePoolPairsListProps {
  searchQuery: string;
  poolPairList: any[];
  isLoadingPoolPairList: boolean;
}

const AvailablePoolPairsList: React.FunctionComponent<AvailablePoolPairsListProps> = (
  props: AvailablePoolPairsListProps
) => {
  const defaultPage = 1;
  const { searchQuery, poolPairList, isLoadingPoolPairList } = props;
  const [tableData, settableData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(defaultPage);

  const pageSize = MASTERNODE_LIST_PAGE_SIZE;
  const total = poolPairList.length;
  const pagesCount = Math.ceil(total / pageSize);
  const from = (currentPage - 1) * pageSize;
  const to = Math.min(total, currentPage * pageSize);

  function paginate(pageNumber, poolPairs?: any[]) {
    const clone = cloneDeep(poolPairs || poolPairList);
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
      const poolPairs: any[] = filterByValue(poolPairList, searchQuery);
      paginate(defaultPage, poolPairs);
    }
  }, [poolPairList, searchQuery]);

  const loadHtml = () => {
    if (isLoadingPoolPairList) {
      return I18n.t('containers.masterNodes.AvailablePoolPairsList.loading');
    }
    if (!tableData.length) {
      return (
        <Card className='table-responsive-md'>
          <CardBody>
            {I18n.t(
              'containers.masterNodes.AvailablePoolPairsList.noMasterNodes'
            )}
          </CardBody>
        </Card>
      );
    }
    return (
      <>
        <Card className={styles.card}>
          <div className={`${styles.tableResponsive} table-responsive-xl`}>
            <Table className={styles.table}>
              <thead>
                <tr>
                  <th></th>
                  <th>{I18n.t('containers.swap.poolTab.pair')}</th>
                  <th>{I18n.t('containers.swap.poolTab.liquidity')}</th>
                  {/* <th>
                    {I18n.t(
                      'containers.swap.poolTab.volume'
                    )}
                  </th> */}
                  <th>{I18n.t('containers.swap.poolTab.apy')}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((poolpair, index) => (
                  <tr key={index}>
                    <td>
                      <PairIcon poolpair={poolpair} />
                    </td>
                    <td>
                      <div>{poolpair.symbol}</div>
                    </td>
                    <td>
                      <div>{poolpair.totalLiquidityInUSDT}</div>
                    </td>
                    {/* <td>
                      <div>{poolpair.operatorAuthAddress}</div>
                    </td> */}
                    <td>
                      <div>{poolpair.apy}</div>
                    </td>
                    <td>
                      <div>
                        <Button
                          to={CREATE_POOL_PAIR_PATH}
                          tag={RRNavLink}
                          color='link'
                          size='sm'
                        >
                          <MdAdd />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>
        {/* <Pagination
          label={I18n.t('containers.wallet.walletPage.paginationRange', {
            to,
            total,
            from: from + 1,
          })}
          currentPage={currentPage}
          pagesCount={pagesCount}
          handlePageClick={paginate}
        /> */}
      </>
    );
  };

  return <>{loadHtml()}</>;
};

const mapStateToProps = (state) => {
  const {
    swap: { isLoadingPoolPairList },
  } = state;
  return {
    isLoadingPoolPairList,
  };
};

export default connect(mapStateToProps)(AvailablePoolPairsList);
