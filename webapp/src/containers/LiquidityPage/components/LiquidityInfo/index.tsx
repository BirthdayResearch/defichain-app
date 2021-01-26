import React, { useEffect } from 'react';
import { NavLink as RRNavLink, RouteComponentProps } from 'react-router-dom';
import { I18n } from 'react-redux-i18n';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import BigNumber from 'bignumber.js';
import { MdArrowBack, MdAdd, MdRemove } from 'react-icons/md';
import { Button, Row, Col, ButtonGroup } from 'reactstrap';

import KeyValueLi from '../../../../components/KeyValueLi';
import { fetchPoolsharesRequest } from '../../reducer';
import Header from '../../../HeaderComponent';
import PairIcon from '../../../../components/PairIcon';
import styles from './LiquidityInfo.module.scss';
import { getPageTitle } from '../../../../utils/utility';
import {
  CREATE_POOL_PAIR_PATH,
  LIQUIDITY_PATH,
  REMOVE_LIQUIDITY_BASE_PATH,
} from '../../../../constants';

interface RouteParams {
  poolID: string;
}

interface LiquidityInfoProps extends RouteComponentProps<RouteParams> {
  fetchPoolsharesRequest: () => void;
  poolshares: any;
}

const LiquidityInfo: React.FunctionComponent<LiquidityInfoProps> = (
  props: LiquidityInfoProps
) => {
  const { poolID } = props.match.params;

  const { poolshares } = props;

  useEffect(() => {
    props.fetchPoolsharesRequest();
  }, []);

  const liquidityAmount = (percentage, reserve) => {
    return new BigNumber(percentage || 0).div(100).times(reserve).toFixed(8);
  };

  const poolshare =
    poolshares.length &&
    poolshares.find((poolShare) => {
      return poolShare.poolID === poolID;
    });

  return (
    <div className='main-wrapper'>
      <Helmet>
        <title>
          {getPageTitle(I18n.t('containers.liquidity.liquidityPage.title'))}
        </title>
      </Helmet>
      <Header>
        <Button
          to={LIQUIDITY_PATH}
          tag={RRNavLink}
          color='link'
          className='header-bar-back'
        >
          <MdArrowBack />
          <span className='d-lg-inline'>
            {I18n.t('containers.liquidity.liquidityPage.back')}
          </span>
        </Button>
        <div className={styles.titleWithIcon}>
          <PairIcon poolpair={poolshare} />
          <h1>{`${poolshare.symbol} ${I18n.t(
            'containers.liquidity.liquidityPage.liquidity'
          )}`}</h1>
        </div>
        <ButtonGroup>
          <Button
            to={`${CREATE_POOL_PAIR_PATH}?idTokenA=${poolshare.idTokenA}&idTokenB=${poolshare.idTokenB}&tokenA=${poolshare.tokenA}&tokenB=${poolshare.tokenB}`}
            tag={RRNavLink}
            color='link'
          >
            <MdAdd />
            <span className='d-lg-inline'>
              {I18n.t('containers.liquidity.liquidityInfo.addMore')}
            </span>
          </Button>
          <Button
            to={`${REMOVE_LIQUIDITY_BASE_PATH}/${
              poolshare.poolID
            }?sharePercentage=${new BigNumber(
              poolshare.poolSharePercentage
            ).toFixed(8)}`}
            disabled={new BigNumber(poolshare.poolSharePercentage).eq(0)}
            tag={RRNavLink}
            color='link'
          >
            <MdRemove />
            <span className='d-lg-inline'>
              {I18n.t('containers.liquidity.liquidityInfo.remove')}
            </span>
          </Button>
        </ButtonGroup>
      </Header>
      <div className='content'>
        <section className='mb-5'>
          <Row className='mb-4'>
            <Col md='6'>
              <KeyValueLi
                label={I18n.t('containers.liquidity.liquidityInfo.apy')}
                value={(
                  `${poolshare.apy ? poolshare.apy : 0} %` || ''
                ).toString()}
              />
            </Col>
            <Col md='6'>
              <KeyValueLi
                label={`${I18n.t(
                  'containers.liquidity.liquidityInfo.pooled'
                )} ${poolshare.tokenA}`}
                value={liquidityAmount(
                  poolshare.poolSharePercentage,
                  poolshare.reserveA
                )}
              />
            </Col>
            <Col md='6'>
              <KeyValueLi
                label={`${I18n.t(
                  'containers.liquidity.liquidityInfo.pooled'
                )} ${poolshare.tokenB}`}
                value={liquidityAmount(
                  poolshare.poolSharePercentage,
                  poolshare.reserveB
                )}
              />
            </Col>
            <Col md='6'>
              <KeyValueLi
                label={`${I18n.t(
                  'containers.liquidity.liquidityInfo.poolShare'
                )}`}
                value={(
                  `${
                    poolshare.poolSharePercentage
                      ? new BigNumber(poolshare.poolSharePercentage).toFixed(4)
                      : ''
                  } %` || ''
                ).toString()}
              />
            </Col>
          </Row>
        </section>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  const { poolshares } = state.liquidity;
  return {
    poolshares,
  };
};

const mapDispatchToProps = {
  fetchPoolsharesRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(LiquidityInfo);
