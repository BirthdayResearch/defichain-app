import React, { Component } from 'react';
import { Card, CardBody, Col, Row } from 'reactstrap';
import styles from './StatCard.module.scss';

interface StatCardProps {
  label: string;
  value: string;
  unit: string;
  icon?: any;
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
            <Col className='col-md-6' style={{ textAlign: 'end' }}>
              {props.icon}
            </Col>
          )}
        </Row>
        <Row>
          &nbsp;
          <Col className={styles.value}>{props.value}</Col>
          <Col
            className={styles.unit}
            style={{ textAlign: 'end', lineHeight: '2.5rem' }}
          >
            {props.unit}
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default StatCard;
