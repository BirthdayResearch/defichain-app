import React, { useEffect, useState } from 'react';
import { NavLink as RRNavLink } from 'react-router-dom';
import cloneDeep from 'lodash/cloneDeep';
import { connect } from 'react-redux';
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
  MASTERNODE_LIST_PAGE_SIZE,
  CREATE_POOL_PAIR_PATH,
  REMOVE_LIQUIDITY_BASE_PATH,
} from '../../../../constants';

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
  const [totalValueLocked, setTotalValueLocked] = useState<number>(0);

  const pageSize = MASTERNODE_LIST_PAGE_SIZE;
  const total = poolPairList.length;

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

  useEffect(() => {
    let tvl = 0;
    tableData.forEach((pool) => {
      const poolAmt = new BigNumber(pool.totalLiquidityInUSDT || 0).toFixed(2);
      tvl += +poolAmt || 0;
    });
    setTotalValueLocked(tvl);
  }, [tableData]);

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
              value={new BigNumber(totalValueLocked).toFixed(2)}
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
                    {I18n.t('containers.swap.poolTab.apy')}
                    <span id='info-text' className={styles['info-text']}>
                      <MdInfoOutline />
                    </span>
                    <UncontrolledTooltip
                      target='info-text'
                      innerClassName='bg-white text-break w-50 h-50 border'
                    >
                      <PopoverBody>
                        <small>
                          {I18n.t('containers.swap.poolTab.apyTooltipMessage')}
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
                {tableData.map((poolpair, index) => (
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
                            poolpair.totalLiquidityInUSDT
                          ).toFixed(2)}
                          defaultValue={0}
                        />
                      </div>
                    </td>
                    <td>
                      <div>{`${poolpair.apy} %`}</div>
                    </td>
                    <td className={styles.actionsCol}>
                      <Button
                        to={`${CREATE_POOL_PAIR_PATH}?idTokenA=${poolpair.idTokenA}&idTokenB=${poolpair.idTokenB}&tokenA=${poolpair.tokenA}&tokenB=${poolpair.tokenB}`}
                        tag={RRNavLink}
                        color='link'
                        size='sm'
                      >
                        <MdAdd />
                      </Button>
                      <Button
                        to={`${REMOVE_LIQUIDITY_BASE_PATH}/${
                          poolpair.poolID
                        }?sharePercentage=${new BigNumber(
                          poolpair.poolSharePercentage
                        ).toFixed(8)}`}
                        disabled={new BigNumber(
                          poolpair.poolSharePercentage
                        ).eq(0)}
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
