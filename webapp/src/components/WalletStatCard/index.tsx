import React from 'react';
import { Card, CardBody } from 'reactstrap';
import styles from './WalletStatCard.module.scss';

interface WalletStatCardProps {
  label: string;
  icon: any;
  subtitle?: string;
}

const WalletStatCard: React.FunctionComponent<WalletStatCardProps> = (
  props: WalletStatCardProps
) => {
  const { label, icon, subtitle } = props;
  return (
    <Card className={styles.card}>
      <CardBody className={styles.cardBody}>
        <div className='d-flex justify-content-center align-items-center'>
          <div>{icon}</div>
        </div>
        <div className={styles.label}>
          <h4 className='mb-0'>{label}</h4>
          <span className={`${styles.subtitle} mb-0`}>{subtitle}</span>
        </div>
      </CardBody>
    </Card>
  );
};

export default WalletStatCard;
