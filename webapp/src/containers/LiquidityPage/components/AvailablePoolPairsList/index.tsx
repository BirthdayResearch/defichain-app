import React, { useEffect, useState } from 'react';
import { NavLink as RRNavLink } from 'react-router-dom';
import cloneDeep from 'lodash/cloneDeep';
import { connect, useSelector } from 'react-redux';
import BigNumber from 'bignumber.js';
import { I18n } from 'react-redux-i18n';
import { MdAdd, MdInfoOutline, MdRemove } from 'react-icons/md';
import {
  Card,
  Table,
  CardBody,
  Button,
  PopoverBody,
  UncontrolledTooltip,
} from 'reactstrap';
import styles from './AvailablePoolPairList.module.scss';
import { filterByValue } from '../../../../utils/utility';
import PairIcon from '../../../../components/PairIcon';
import NumberMask from '../../../../components/NumberMask';
import {
  CREATE_POOL_PAIR_PATH,
  REMOVE_LIQUIDITY_BASE_PATH,
} from '../../../../constants';
import Pagination from '../../../../components/Pagination';
import { RootState } from '../../../../app/rootTypes';

interface AvailablePoolPairsListProps {
  searchQuery: string;
  poolPairList: any[];
  isLoadingPoolPairList: boolean;
  poolshares: any;
}

const AvailablePoolPairsList: React.FunctionComponent<AvailablePoolPairsListProps> =
  (props: AvailablePoolPairsListProps) => {
    const defaultPage = 1;
    const { searchQuery, poolPairList, isLoadingPoolPairList, poolshares } = props;
    const [tableData, settableData] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(defaultPage);
    const stats = useSelector((state: RootState) => state.app.stats)

    const pageSize = 7;
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

    const getPoolShare = (id: string): BigNumber => {
      const ps = poolshares.find((p) => p.poolID === id)
      return ps !== undefined ? new BigNumber(ps.poolSharePercentage) : new BigNumber(0)
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
        return I18n.t('containers.liquidity.liquidityPage.loading');
      }
      if (!tableData.length) {
        return (
          <Card className='table-responsive-md'>
            <CardBody>
              {I18n.t('containers.liquidity.liquidityPage.noPoolPairs')}
            </CardBody>
          </Card>
        );
      }
      return (
        <>
          <div>
            <label htmlFor='totalLiquidity'>
              {I18n.t('containers.swap.poolTab.totalValueLocked')}
            </label>
            <h6 id='totalLiquidity'>
              <NumberMask
                value={new BigNumber(stats?.tvl?.dex ?? 0).toFixed(2)}
                defaultValue={0}
              />
            </h6>
          </div>
          <Card className={styles.card}>
            <div className={`${styles.tableResponsive} table-responsive-xl`}>
              <Table className={styles.table}>
                <thead>
                  <tr>
                    <th></th>
                    <th>{I18n.t('containers.swap.poolTab.pair')}</th>
                    <th>{I18n.t('containers.swap.poolTab.totalLiquidity')}</th>
                    <th>
                      {I18n.t('containers.swap.poolTab.apr')}
                      <span id='info-text' className={styles['info-text']}>
                        <MdInfoOutline />
                      </span>
                      <UncontrolledTooltip
                        target='info-text'
                        innerClassName='bg-white text-break w-50 h-50 border'
                      >
                        <PopoverBody>
                          <small>
                            {I18n.t(
                              'containers.swap.poolTab.apyTooltipMessage'
                            )}
                          </small>
                        </PopoverBody>
                      </UncontrolledTooltip>
                    </th>
                    <th className={styles.actionsCol}>
                      {I18n.t('containers.swap.poolTab.addRemoveLiquidity')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.sort((a, b) => new BigNumber(
                              b.totalLiquidity.usd
                            ).minus(a.totalLiquidity.usd).toNumber()).map((poolpair, index) => (
                    <tr key={index}>
                      <td className={styles.pairIconCol}>
                        <PairIcon poolpair={poolpair} />
                      </td>
                      <td>
                        <div>{poolpair.symbol}</div>
                      </td>
                      <td>
                        <div>
                          <NumberMask
                            value={new BigNumber(
                              poolpair.totalLiquidity.usd
                            ).toFixed(2)}
                            defaultValue={0}
                          />
                        </div>
                      </td>
                      <td>
                        <div>{`${new BigNumber(poolpair.apr.total)
                          .times(100)
                          .toFixed(2)} %`}</div>
                      </td>
                      <td className={styles.actionsCol}>
                        <Button
                          to={`${CREATE_POOL_PAIR_PATH}?idTokenA=${poolpair.tokenA.id}&idTokenB=${poolpair.tokenB.id}&tokenA=${poolpair.tokenA.symbol}&tokenB=${poolpair.tokenB.symbol}`}
                          tag={RRNavLink}
                          color='link'
                          size='sm'
                        >
                          <MdAdd />
                        </Button>
                        <Button
                          to={`${REMOVE_LIQUIDITY_BASE_PATH}/${
                            poolpair.id
                          }?sharePercentage=${getPoolShare(poolpair.id).toFixed(8)}`}
                          disabled={getPoolShare(poolpair.id).lte(0)}
                          tag={RRNavLink}
                          color='link'
                          size='sm'
                        >
                          <MdRemove />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card>
          <Pagination
                label={I18n.t(
                  'containers.liquidity.liquidityPage.paginationRange',
                  {
                    to,
                    total,
                    from: from + 1,
                  }
                )}
                currentPage={currentPage}
                pagesCount={pagesCount}
                handlePageClick={paginate}
              />
        </>
      );
    };

    return <>{loadHtml()}</>;
  };

const mapStateToProps = (state) => {
  const {
    liquidity: { isLoadingPoolPairList },
  } = state;
  return {
    isLoadingPoolPairList,
  };
};

export default connect(mapStateToProps)(AvailablePoolPairsList);
