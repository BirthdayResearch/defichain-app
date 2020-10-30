import React from 'react';
import { Card, CardBody, Col, Row } from 'reactstrap';

import styles from '../TokenCard.module.scss';
import { IWalletTokenCard } from '../../../utils/interfaces';
import { getIcon } from '../../../utils/utility';

interface WalletTokenCardProps {
  token: IWalletTokenCard;
  handleCardClick: (
    symbol: string | null,
    hash: string,
    amount: any,
    address: string
  ) => void;
}

const WalletTokenCard: React.FunctionComponent<WalletTokenCardProps> = (
  props: WalletTokenCardProps
) => {
  const { handleCardClick, token } = props;

  return (
    <Card
      className={styles.tokenBalanceCard}
      onClick={() =>
        handleCardClick(token.symbol, token.hash, token.amount, token.address)
      }
    >
      <CardBody className={styles.cardBody}>
        <Row className='align-items-center'>
          <Col md='6'>
            <div className='d-flex align-items-center justify-content-start'>
              <div>
                <img
                  src={getIcon(token.symbol)}
                  height={'30px'}
                  width={'30px'}
                />
              </div>
              <div className='ml-4'>
                <div>
                  <b>{token.symbol}</b>
                </div>
                <div className={styles.cardValue}>{token.name}</div>
              </div>
            </div>
          </Col>
          <Col md='6'>
            <div className={`${styles.cardValue} justify-content-end`}>
              <b className='text-dark'>{token.amount}</b>
              <span className='ml-2'>{token.symbol}</span>
            </div>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default WalletTokenCard;
