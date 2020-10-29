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
        <Row>
          <Col md='6'>
            <div className='d-flex'>
              <img src={getIcon(token.symbol)} height={'30px'} width={'30px'} />
              <div className='ml-4'>
                <div>
                  <b>{token.symbol}</b>
                </div>
                <div className={styles.cardValue}>{token.name}</div>
              </div>
            </div>
          </Col>
          <Col md='6'>
            <div className='float-right'>
              <div className={styles.cardValue}>
                <b className='text-dark'>{token.amount}</b>
                <span className='ml-2'>{token.symbol}</span>
              </div>
              {/* <div className={styles.cardValue}>{'220 USD'}</div> */}
            </div>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default WalletTokenCard;
