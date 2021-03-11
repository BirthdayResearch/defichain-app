import React from 'react';
import { Card, CardBody, Col, Row } from 'reactstrap';
import { I18n } from 'react-redux-i18n';

import styles from '../TokenCard.module.scss';
import { IWalletTokenCard } from '../../../utils/interfaces';

import TokenAvatar from '../../TokenAvatar';
import NumberMask from '../../NumberMask';
import BigNumber from 'bignumber.js';

interface WalletTokenCardProps {
  token: IWalletTokenCard;
  handleCardClick: (
    symbol: string | null,
    hash: string,
    amount: any,
    address: string,
    isLPS: boolean
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
        handleCardClick(
          token.symbol,
          token.hash,
          token.amount,
          token.address,
          token.isLPS ?? false
        )
      }
    >
      <CardBody className={styles.cardBody}>
        <Row className='align-items-center'>
          <Col md='6'>
            <div className='d-flex align-items-center justify-content-start'>
              <div>
                <TokenAvatar symbol={token.symbolKey} textSizeRatio={2} />
              </div>
              <div className='ml-4'>
                <div>
                  <b>{token.symbolKey}</b>
                </div>
                <div className={styles.cardValue}>
                  {token.isLPS
                    ? `${I18n.t(
                        'containers.tokens.tokensPage.dctLabels.liquidityTokenFor'
                      )} ${token.symbolKey}`
                    : token.name}
                </div>
              </div>
            </div>
          </Col>
          <Col md='6'>
            <div className={`${styles.cardValue} justify-content-end`}>
              <b className='text-dark'>
                <NumberMask
                  value={new BigNumber(token.amount || 0).toFixed(8)}
                />
              </b>
              <span className='ml-2'>{token.symbolKey}</span>
            </div>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default WalletTokenCard;
