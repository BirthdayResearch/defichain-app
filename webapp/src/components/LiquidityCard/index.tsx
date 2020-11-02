import React from 'react';
import { I18n } from 'react-redux-i18n';
import { Row, Card, CardBody, CardFooter, Col } from 'reactstrap';
import { ITokenBalanceInfo } from '../../utils/interfaces';

import SwapDropdown from '../swapDropdown';
import styles from './LiquidityCard.module.scss';

interface LiquidityCardProps {
  label: string;
  balance: number;
  amount: number;
  tokenMap: Map<string, ITokenBalanceInfo>;
}

const LiquidityCard: React.FunctionComponent<LiquidityCardProps> = (
  props: LiquidityCardProps
) => {
  const { label, balance, amount, tokenMap } = props;

  return (
    <Card className={styles.liquidityCard}>
      <CardBody className={styles.cardBody}>
        <Row>
          <Col className={styles.labelDirection}>{label}</Col>
        </Row>
        <Row>
          <Col className='mt-2'>{amount}</Col>
          <Col className={styles.dropDownCol}>
            <SwapDropdown tokenMap={tokenMap} />
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
