import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import { MdAdd } from 'react-icons/md';
import { Button, ButtonGroup, Pagination } from 'reactstrap';
import { NavLink as RRNavLink } from 'react-router-dom';
import Helmet from 'react-helmet';

import {
  CREATE_POOL_PAIR_PATH,
  DEFICHAIN_DEX_YOUTUBE_LINK,
  DEFICHAIN_IMPERMANENT_YOUTUBE_LINK,
  LIQUIDITY_MINING_YOUTUBE_LINK,
} from '../../constants';
import styles from './liquidity.module.scss';
import LiquidityList from './components/LiquidityList';
import { fetchPoolPairListRequest, fetchPoolsharesRequest } from './reducer';
import AvailablePoolPairsList from './components/AvailablePoolPairsList';
import LiquidityMining from '../../assets/svg/liquidity-mining.svg';
import DefichainDEX from '../../assets/svg/defichain-dex.svg';
import DefichainImpermanent from '../../assets/svg/defichain-impermanent.svg';
import openNewTab from '../../utils/openNewTab';
import Header from '../HeaderComponent';
import { getPageTitle } from '../../utils/utility';

interface LiquidityPageProps {
  history: any;
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
        <title>
          {getPageTitle(I18n.t('containers.liquidity.liquidityPage.title'))}
        </title>
      </Helmet>
      <Header>
        <h1>{I18n.t('containers.liquidity.liquidityPage.liquidityPools')}</h1>
        <ButtonGroup>
          <Button to={CREATE_POOL_PAIR_PATH} tag={RRNavLink} color='link'>
            <MdAdd />
            <span className='d-lg-inline'>
              {I18n.t('containers.liquidity.liquidityPage.addLiquidity')}
            </span>
          </Button>
        </ButtonGroup>
      </Header>
      {isLoadingPoolshares ? (
        <div className='content'>
          {I18n.t('containers.liquidity.liquidityPage.loading')}
        </div>
      ) : (
        <div className='content'>
          {!poolshares.length ? (
            <>
              <section>
                <p>
                  {I18n.t(
                    'containers.liquidity.liquidityPage.yourLiquidityInfo'
                  )}
                </p>
                <div className='d-flex justify-content-center mb-5'>
                  <div
                    className={styles.videoThumbnailWrapper}
                    onClick={() => openNewTab(LIQUIDITY_MINING_YOUTUBE_LINK)}
                  >
                    <img
                      src={LiquidityMining}
                      className={styles.videoThumbnail}
                    />
                    {I18n.t('containers.liquidity.liquidityPage.watchVideo')}
                  </div>
                  <div
                    className={styles.videoThumbnailWrapper}
                    onClick={() => openNewTab(DEFICHAIN_DEX_YOUTUBE_LINK)}
                  >
                    <img src={DefichainDEX} className={styles.videoThumbnail} />
                    {I18n.t('containers.liquidity.liquidityPage.watchVideo')}
                  </div>
                  <div
                    className={styles.videoThumbnailWrapper}
                    onClick={() =>
                      openNewTab(DEFICHAIN_IMPERMANENT_YOUTUBE_LINK)
                    }
                  >
                    <img
                      src={DefichainImpermanent}
                      className={styles.videoThumbnail}
                    />
                    {I18n.t('containers.liquidity.liquidityPage.watchVideo')}
                  </div>
                </div>
              </section>
            </>
          ) : (
            <LiquidityList poolshares={poolshares} history={props.history} />
          )}
          <section className='mb-5'>
            <h2 className='mb-1'>
              {I18n.t('containers.liquidity.liquidityPage.availablePoolPairs')}
            </h2>
            <AvailablePoolPairsList
              searchQuery={''}
              poolPairList={poolPairList}
              poolshares={poolshares}
            />
          </section>
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
  } = state.liquidity;
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
