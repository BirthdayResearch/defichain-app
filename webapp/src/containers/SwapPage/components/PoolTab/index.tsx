import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import { MdCompareArrows } from 'react-icons/md';
import { Button } from 'reactstrap';
import { NavLink as RRNavLink } from 'react-router-dom';

import { CREATE_POOL_PAIR_PATH } from '../../../../constants';
import styles from './poolTab.module.scss';
import LiquidityList from '../LiquidityList';
import { fetchPoolsharesRequest } from '../../reducer';

interface PoolTabProps {
  history: History;
  poolshares: any;
  fetchPoolsharesRequest: () => void;
}

const PoolTab: React.FunctionComponent<PoolTabProps> = (
  props: PoolTabProps
) => {
  const { poolshares, fetchPoolsharesRequest } = props;

  useEffect(() => {
    fetchPoolsharesRequest();
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
    </>
  );
};

const mapStateToProps = (state) => {
  const { poolshares, isPoolsharesLoaded, isLoadingPoolshares } = state.swap;
  return {
    poolshares,
    isPoolsharesLoaded,
    isLoadingPoolshares,
  };
};

const mapDispatchToProps = {
  fetchPoolsharesRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(PoolTab);
