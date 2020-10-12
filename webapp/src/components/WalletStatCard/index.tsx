import React from 'react';
import { Card, CardBody, CardFooter, Col } from 'reactstrap';
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
      <Card>
        <CardBody>
          <div className={styles.icon}>
            <div>{icon}</div>
          </div>
        </CardBody>
        <CardFooter>
          <div className={styles.label}>
            <div>{label}</div>
          </div>
        </CardFooter>
      </Card>
  );
};

export default WalletStatCard;
