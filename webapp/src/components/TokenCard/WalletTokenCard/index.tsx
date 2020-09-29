import React from 'react';
import { Card, CardBody, Col, Row } from 'reactstrap';

import styles from '../TokenCard.module.scss';
import Icon from '../../../assets/svg/icon-coin-bitcoin-lapis.svg';

interface WalletTokenCardProps {
  handleCardClick: (symbol: string) => void;
}

const WalletTokenCard: React.FunctionComponent<WalletTokenCardProps> = (
  props: WalletTokenCardProps
) => {
  const { handleCardClick } = props;

  return (
    <Card className={styles.tokenCard} onClick={() => handleCardClick('DAT')}>
      <CardBody className={styles.cardBody}>
        <Row>
          <Col md='6'>
            <div className='d-flex'>
              <img src={Icon} />
              <div className='ml-4'>
                <div>
                  <b>{'DFI'}</b>
                </div>
                <div className={styles.cardValue}>{'Defi Blockchain'}</div>
              </div>
            </div>
          </Col>
          <Col md='6'>
            <div className='float-right'>
              <div className={styles.cardValue}>
                <b className='text-dark'>{'1,000'}</b>
                <span className='ml-2'>{'DFI'}</span>
              </div>
              <div className={styles.cardValue}>{'220 USD'}</div>
            </div>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default WalletTokenCard;
