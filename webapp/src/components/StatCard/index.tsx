import React from 'react';
import { Card, CardBody, Col, Row } from 'reactstrap';
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
              md='6'
              className={`${styles.statCardIcon} ${
                props.refreshFlag ? styles.statCardIconAnimation : ''
              }`}
            >
              {props.icon}
            </Col>
          )}
        </Row>
        <Row>
          &nbsp;
          <Col className={styles.value}>{props.value}</Col>
          <Col className={`${styles.unit} ${styles.text}`}>{props.unit}</Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default StatCard;
