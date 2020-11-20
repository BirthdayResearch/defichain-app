import React, { useEffect } from 'react';
import { NavLink as RRNavLink, RouteComponentProps } from 'react-router-dom';
import { I18n } from 'react-redux-i18n';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { MdArrowBack, MdAdd, MdRemove } from 'react-icons/md';
import { Button, Row, Col, ButtonGroup } from 'reactstrap';

import KeyValueLi from '../../../../components/KeyValueLi';
import { fetchPoolsharesRequest } from '../../reducer';
import {
  CREATE_POOL_PAIR_PATH,
  LIQUIDITY_PATH,
  REMOVE_LIQUIDITY_BASE_PATH,
} from '../../../../constants';
import Header from '../../../HeaderComponent';
import PairIcon from '../../../../components/PairIcon';

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

  const poolshare =
    poolshares.length &&
    poolshares.find((poolShare) => {
      return poolShare.poolID === poolID;
    });

  return (
    <div className='main-wrapper'>
      <Helmet>
        <title>{I18n.t('containers.liquidity.liquidityPage.title')}</title>
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
        <div className='d-flex inline'>
          <PairIcon poolpair={poolshare} />
          &nbsp;
          <h1>{`${poolshare.symbol} ${I18n.t(
            'containers.liquidity.liquidityPage.liquidity'
          )}`}</h1>
        </div>
        <ButtonGroup>
          <Button to={CREATE_POOL_PAIR_PATH} tag={RRNavLink} color='link'>
            <MdAdd />
            <span className='d-lg-inline'>
              {I18n.t('containers.liquidity.liquidityInfo.addMore')}
            </span>
          </Button>
          <Button
            to={`${REMOVE_LIQUIDITY_BASE_PATH}/${
              poolshare.poolID
            }?sharePercentage=${Number(poolshare.poolSharePercentage).toFixed(
              8
            )}`}
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
                  `${poolshare.apy ? poolshare.apy : ''} %` || ''
                ).toString()}
              />
            </Col>
            <Col md='6'>
              <KeyValueLi
                label={`${I18n.t(
                  'containers.liquidity.liquidityInfo.pooled'
                )} ${poolshare.tokenA}`}
                value={(poolshare.reserveA || '0').toString()}
              />
            </Col>
            <Col md='6'>
              <KeyValueLi
                label={`${I18n.t(
                  'containers.liquidity.liquidityInfo.pooled'
                )} ${poolshare.tokenB}`}
                value={(poolshare.reserveB || '').toString()}
              />
            </Col>
            <Col md='6'>
              <KeyValueLi
                label={I18n.t(
                  'containers.liquidity.liquidityInfo.btcPoolShare'
                )}
                value={(
                  `${
                    poolshare.poolSharePercentage
                      ? poolshare.poolSharePercentage
                      : ''
                  } %` || ''
                ).toString()}
              />
            </Col>
            <Col md='6'>
              <KeyValueLi
                label={I18n.t(
                  'containers.liquidity.liquidityInfo.dfiPoolShare'
                )}
                value={(
                  `${
                    poolshare.poolSharePercentage
                      ? poolshare.poolSharePercentage
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
  const { poolshares } = state.swap;
  return {
    poolshares,
  };
};

const mapDispatchToProps = {
  fetchPoolsharesRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(LiquidityInfo);
