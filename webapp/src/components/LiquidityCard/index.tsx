import React from 'react';
import { I18n } from 'react-redux-i18n';
import { Row, Card, CardBody, CardFooter, Col } from 'reactstrap';

import SwapDropdown from '../swapDropdown';
import styles from './LiquidityCard.module.scss';

interface LiquidityCardProps {
  label: string;
  balance: number;
  amount: number;
  popularTokenMap: Map<string, string>;
  normalTokenMap: Map<string, string>;
}

const LiquidityCard: React.FunctionComponent<LiquidityCardProps> = (
  props: LiquidityCardProps
) => {
  const { label, balance, amount, popularTokenMap, normalTokenMap } = props;

  return (
    <Card className={styles.liquidityCard}>
      <CardBody className={styles.cardBody}>
        <Row>
          <Col className={styles.labelDirection}>{label}</Col>
        </Row>
        <Row>
          <Col className='mt-2'>{amount}</Col>
          <Col className={styles.dropDownCol}>
            <SwapDropdown
              popularTokenMap={popularTokenMap}
              normalTokenMap={normalTokenMap}
            />
          </Col>
        </Row>
      </CardBody>
      <CardFooter>
        <Row>
          <Col>
            <span className={styles.labelBalance}>
              {I18n.t('components.swapCard.balance')}
            </span>
            : {balance}
          </Col>
          <Col className={styles.colorMax}>
            {I18n.t('components.swapCard.max')}
          </Col>
        </Row>
      </CardFooter>
    </Card>
  );
};

export default LiquidityCard;
