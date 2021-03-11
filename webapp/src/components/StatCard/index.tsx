import BigNumber from 'bignumber.js';
import React from 'react';
import { Card, CardBody, Col, Row } from 'reactstrap';
import NumberMask from '../NumberMask';
import styles from './StatCard.module.scss';

interface StatCardProps {
  label: string;
  value: string;
  unit: string;
  icon?: any;
  refreshFlag?: any;
}

const StatCard: React.FunctionComponent<StatCardProps> = (
  props: StatCardProps
) => {
  return (
    <Card className={styles.statCard}>
      <CardBody className={styles.cardBody}>
        <Row>
          <Col className={styles.label}>{props.label}</Col>
          {props.icon && (
            <Col
              className={`${styles.statCardActionWithIcon} ${
                props.refreshFlag ? styles.statCardActionWithIconAnimation : ''
              }`}
            >
              {props.icon}
            </Col>
          )}
        </Row>
        <Row className={styles.valueUnit}>
          <Col className={styles.value}>
            <NumberMask
              value={new BigNumber(props.value).toFixed(8)}
              defaultValue={0}
            />
          </Col>
          <Col className={`${styles.unit} ${styles.text}`}>{props.unit}</Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default StatCard;
