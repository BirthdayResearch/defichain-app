import React from 'react';
import { Card, CardBody } from 'reactstrap';
import styles from './WalletStatCard.module.scss';

interface WalletStatCardProps {
  label: string;
  icon: any;
}

const WalletStatCard: React.FunctionComponent<WalletStatCardProps> = (
  props: WalletStatCardProps
) => {
  const { label, icon } = props;
  return (
    <Card className={styles.card}>
      <CardBody className={styles.cardBody}>
        <div className={styles.icon}>
          <div>{icon}</div>
        </div>
        <div className={styles.label}>
          <div>{label}</div>
        </div>
      </CardBody>
    </Card>
  );
};

export default WalletStatCard;
