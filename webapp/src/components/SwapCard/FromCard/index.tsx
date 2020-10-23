import React from 'react';
import { Row, Card, CardBody } from 'reactstrap';
import styles from '../SwapCard.module.scss';

interface FromCardProps {}

const FromCard: React.FunctionComponent<FromCardProps> = (
  props: FromCardProps
) => {
  return (
    <Card className={styles.swapCard}>
      <CardBody className={styles.cardBody}>
        <Row className='mb-3'></Row>
      </CardBody>
    </Card>
  );
};

export default FromCard;
