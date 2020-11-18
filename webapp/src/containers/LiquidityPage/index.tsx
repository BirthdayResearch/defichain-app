import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import { MdAdd, MdCompareArrows } from 'react-icons/md';
import { Button, ButtonGroup } from 'reactstrap';
import { NavLink as RRNavLink } from 'react-router-dom';
import Helmet from 'react-helmet';

import { CREATE_POOL_PAIR_PATH } from '../../constants';
import styles from './liquidity.module.scss';
import LiquidityList from './components/LiquidityList';
import { fetchPoolPairListRequest, fetchPoolsharesRequest } from './reducer';
import AvailablePoolPairsList from './components/AvailablePoolPairsList';

interface LiquidityPageProps {
  history: History;
  poolshares: any;
  poolPairList: any;
  fetchPoolsharesRequest: () => void;
  fetchPoolPairListRequest: () => void;
  isLoadingPoolshares: boolean;
}

const LiquidityPage: React.FunctionComponent<LiquidityPageProps> = (
  props: LiquidityPageProps
) => {
  const {
    poolshares,
    fetchPoolsharesRequest,
    poolPairList,
    fetchPoolPairListRequest,
    isLoadingPoolshares,
  } = props;

  useEffect(() => {
    fetchPoolsharesRequest();
    fetchPoolPairListRequest();
  }, []);

  return (
    <div className='main-wrapper'>
      <Helmet>
        <title>{I18n.t('containers.liquidity.liquidityPage.title')}</title>
      </Helmet>
      <header className='header-bar'>
        <h1>{I18n.t('containers.liquidity.liquidityPage.liquidityPools')}</h1>
        <ButtonGroup>
          <Button to={CREATE_POOL_PAIR_PATH} tag={RRNavLink} color='link'>
            <MdAdd />
            <span className='d-lg-inline'>
              {I18n.t('containers.liquidity.liquidityPage.addLiquidity')}
            </span>
          </Button>
        </ButtonGroup>
      </header>
      {isLoadingPoolshares ? (
        I18n.t('containers.liquidity.liquidityPage.loading')
      ) : (
        <div className='content'>
          {!poolshares.length ? (
            <>
              <section>
                {I18n.t('containers.liquidity.liquidityPage.yourLiquidity')}
              </section>
              <div className='text-center'>
                <MdCompareArrows size={50} className={styles.svg} />
                <div className={styles.txtColor}>
                  {I18n.t('containers.liquidity.liquidityPage.noLiquidity')}
                  {/* {I18n.t('containers.liquidity.liquidityPage.watchVideo')} */}
                </div>
                <Button to={CREATE_POOL_PAIR_PATH} tag={RRNavLink} color='link'>
                  <div className={styles.labelAddLiquidity}>
                    {I18n.t('containers.liquidity.liquidityPage.addLiquidity')}
                  </div>
                </Button>
              </div>
            </>
          ) : (
            <LiquidityList poolshares={poolshares} history={props.history} />
          )}
          <div>
            <section className={`${styles.sectionYourLliquidity} mb-5 mt-5`}>
              {I18n.t('containers.liquidity.liquidityPage.availablePoolPairs')}
            </section>
            <AvailablePoolPairsList
              searchQuery={''}
              poolPairList={poolshares}
            />
          </div>
        </div>
      )}
    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(LiquidityPage);
