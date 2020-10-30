import React, { useState } from 'react';
import { I18n } from 'react-redux-i18n';
import { Row, Card, CardBody, CardFooter, Col, Input } from 'reactstrap';

import SwapDropdown from '../swapDropdown';
import styles from './SwapCard.module.scss';

interface SwapCardProps {
  label: string;
  isFrom: boolean;
  balance: number;
  popularTokenMap: Map<string, string>;
  normalTokenMap: Map<string, string>;
}

const SwapCard: React.FunctionComponent<SwapCardProps> = (
  props: SwapCardProps
) => {
  const { isFrom, label, balance, popularTokenMap, normalTokenMap } = props;

  const [fromAmount, setFromAmount] = useState(0);

  const onInputChange = (e) => {
    setFromAmount(e.target.value);
  };

  // temporary condition, need to update
  const amount = isFrom ? fromAmount : Number(fromAmount) * 10 || 0;

  return (
    <Card className={styles.swapCard}>
      <CardBody className={styles.cardBody}>
        <Row>
          <Col className={styles.labelDirection}>{label}</Col>
        </Row>
        <Row>
          <Col className='mt-2'>
            {isFrom ? (
              <Input
                className='border-0'
                type='text'
                value={amount}
                onChange={onInputChange}
              ></Input>
            ) : (
              amount
            )}
          </Col>
          <Col className={styles.dropDownCol}>
            <SwapDropdown
              popularTokenMap={popularTokenMap}
              normalTokenMap={normalTokenMap}
            />
          </Col>
        </Row>
      </CardBody>
      <CardFooter className={styles.cardFooter}>
        <Row>
          <Col>
            <span className={styles.labelBalance}>
              {I18n.t('components.swapCard.balance')}
            </span>
            : {balance}
          </Col>
          {isFrom && (
            <Col className={styles.colorMax}>
              {I18n.t('components.swapCard.max')}
            </Col>
          )}
        </Row>
      </CardFooter>
    </Card>
  );
};

export default SwapCard;
