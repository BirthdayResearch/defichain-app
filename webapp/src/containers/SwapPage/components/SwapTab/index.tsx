import React, { useEffect } from 'react';
import { Row, Col } from 'reactstrap';
import { MdCompareArrows } from 'react-icons/md';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';

import SwapCard from '../../../../components/SwapCard';
import { fetchPoolsharesRequest } from '../../reducer';
import styles from './swapTab.module.scss';

interface SwapTabProps {
  poolshares: any;
  fetchPoolsharesRequest: () => void;
}

const SwapTab: React.FunctionComponent<SwapTabProps> = (
  props: SwapTabProps
) => {
  const { poolshares, fetchPoolsharesRequest } = props;

  const popularTokenList: Map<string, number> = new Map([
    ['DFI', 10],
    ['BTC', 20],
    ['ETH', 30],
  ]);
  const normalTokenList: Map<string, number> = new Map([
    ['DOO', 40],
    ['MEOW', 50],
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
              popularTokenList={popularTokenList}
              normalTokenList={normalTokenList}
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
              popularTokenList={popularTokenList}
              normalTokenList={normalTokenList}
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
