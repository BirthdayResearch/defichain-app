import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import { MdCompareArrows } from 'react-icons/md';
import { Button } from 'reactstrap';
import { NavLink as RRNavLink } from 'react-router-dom';

import { CREATE_POOL_PAIR_PATH } from '../../../../constants';
import styles from './poolTab.module.scss';
import LiquidityList from '../LiquidityList';
import {
  fetchPoolPairListRequest,
  fetchPoolsharesRequest,
} from '../../reducer';
import AvailablePoolPairsList from '../AvailablePoolPairsList';

interface PoolTabProps {
  history: History;
  poolshares: any;
  poolPairList: any;
  fetchPoolsharesRequest: () => void;
  fetchPoolPairListRequest: () => void;
}

const PoolTab: React.FunctionComponent<PoolTabProps> = (
  props: PoolTabProps
) => {
  const {
    poolshares,
    fetchPoolsharesRequest,
    poolPairList,
    fetchPoolPairListRequest,
  } = props;

  useEffect(() => {
    fetchPoolsharesRequest();
    fetchPoolPairListRequest();
  }, []);

  return (
    <>
      <section className={`${styles.sectionYourLliquidity} mb-5`}>
        {I18n.t('containers.swap.poolTab.yourLiquidity')}
      </section>
      {!poolshares.length ? (
        <div className='text-center'>
          <MdCompareArrows size={50} className={styles.svg} />
          <div>{I18n.t('containers.swap.poolTab.noLiquidity')}</div>
          <Button to={CREATE_POOL_PAIR_PATH} tag={RRNavLink} color='link'>
            <div className={styles.labelAddLiquidity}>
              {I18n.t('containers.swap.poolTab.addLiquidity')}
            </div>
          </Button>
        </div>
      ) : (
        <LiquidityList poolshares={poolshares} history={props.history} />
      )}
      <div>
        <section className={`${styles.sectionYourLliquidity} mb-5 mt-5`}>
          {I18n.t('containers.swap.poolTab.availablePoolPairs')}
        </section>
        <AvailablePoolPairsList searchQuery={''} poolPairList={poolPairList} />
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  const {
    poolshares,
    isPoolsharesLoaded,
    isLoadingPoolshares,
    poolPairList,
  } = state.swap;
  return {
    poolPairList,
    poolshares,
    isPoolsharesLoaded,
    isLoadingPoolshares,
  };
};

const mapDispatchToProps = {
  fetchPoolsharesRequest,
  fetchPoolPairListRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(PoolTab);
