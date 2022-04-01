import React from 'react';
import { I18n } from 'react-redux-i18n';
import { Row, Col } from 'reactstrap';

import LiquidityAccordion from '../../../../components/LiquidityAccordion';

interface LiquidityListProps {
  poolshares: any;
  history?: History;
}

const LiquidityList: React.FunctionComponent<LiquidityListProps> = (
  props: LiquidityListProps
) => {
  const { poolshares } = props;
  return (
    <>
      <section>
        <h2>{I18n.t('containers.liquidity.liquidityPage.yourLiquidity')}</h2>
        <Row>
          {poolshares.map((poolpair, i) => (
            <Col md='6' key={i}>
              <LiquidityAccordion poolpair={poolpair} history={props.history} />
            </Col>
          ))}
        </Row>
      </section>
    </>
  );
};

export default LiquidityList;
