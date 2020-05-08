import React, { Component } from 'react';
import { Card, CardBody } from 'reactstrap';
import styles from './StatCard.module.scss';

interface StatCardProps {
  label: string;
  value: string;
  unit: string;
}

const StatCard: React.FunctionComponent<StatCardProps> = (
  props: StatCardProps
) => {
  return (
    <Card className={styles.statCard}>
      <CardBody className={styles.cardBody}>
        <div className={styles.label}>{props.label}</div>
        <div className={styles.value}>{props.value}</div>
        <div className={styles.unit}>{props.unit}</div>
      </CardBody>
    </Card>
  );
};

export default StatCard;
