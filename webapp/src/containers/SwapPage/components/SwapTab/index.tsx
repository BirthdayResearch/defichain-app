import React, { useEffect } from 'react';
import { Row, Col } from 'reactstrap';
import { MdCompareArrows } from 'react-icons/md';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';

import SwapCard from '../../../../components/SwapCard';
import { fetchPoolsharesRequest } from '../../reducer';
import styles from './swapTab.module.scss';
import { ITokenBalanceInfo } from '../../../../utils/interfaces';

interface SwapTabProps {
  poolshares: any;
  fetchPoolsharesRequest: () => void;
}

const SwapTab: React.FunctionComponent<SwapTabProps> = (
  props: SwapTabProps
) => {
  const { poolshares, fetchPoolsharesRequest } = props;

  const tokenMap: Map<string, ITokenBalanceInfo> = new Map([
    ['DFI', { balance: '10', isPopularToken: true, hash: '0' }],
    ['BTC', { balance: '20', isPopularToken: true, hash: '1' }],
    ['ETH', { balance: '30', isPopularToken: true, hash: '2' }],
    ['DOO', { balance: '40', isPopularToken: false, hash:'3' }],
    ['MEOW', { balance: '50', isPopularToken: false, hash: '4' }],
  ]);

  useEffect(() => {
    fetchPoolsharesRequest();
  }, []);

  return (
    <>
      <section>
        <Row>
          <Col md='5'>
            <SwapCard
              isFrom={true}
              label={I18n.t('containers.swap.swapTab.from')}
              balance={100}
              tokenMap={tokenMap}
            />
          </Col>
          <Col md='2' className={styles.colSvg}>
            <MdCompareArrows className={styles.svg} />
          </Col>
          <Col md='5'>
            <SwapCard
              isFrom={false}
              label={I18n.t('containers.swap.swapTab.to')}
              balance={100}
              tokenMap={tokenMap}
            />
          </Col>
        </Row>
      </section>
    </>
  );
};

const mapStateToProps = (state) => {
  const { poolshares } = state.swap;
  return { poolshares };
};

const mapDispatchToProps = {
  fetchPoolsharesRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(SwapTab);
