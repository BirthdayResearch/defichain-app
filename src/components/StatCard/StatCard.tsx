import React, { Component } from "react";
import { Card, CardBody } from "reactstrap";
import styles from "./StatCard.module.scss";
import { StatCardProps, StatCardState } from "./StatCard.interface";

class StatCard extends Component<StatCardProps, StatCardState> {
  render() {
    return (
      <Card className={styles.statCard}>
        <CardBody className={styles.cardBody}>
          <div className={styles.label}>{this.props.label}</div>
          <div className={styles.value}>{this.props.value}</div>
          <div className={styles.unit}>{this.props.unit}</div>
        </CardBody>
      </Card>
    );
  }
}

export default StatCard;
