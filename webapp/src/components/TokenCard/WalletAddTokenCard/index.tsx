import React from 'react';
import { Card, CardBody, Col, Row, Button } from 'reactstrap';
import { I18n } from 'react-redux-i18n';

import styles from '../TokenCard.module.scss';
import { IWalletTokenCard } from '../../../utils/interfaces';
// import Icon from '../../../assets/svg/icon-coin-bitcoin-lapis.svg';

interface WalletAddTokenCardProps {
  token: IWalletTokenCard;
}

const WalletAddTokenCard: React.FunctionComponent<WalletAddTokenCardProps> = (
  props: WalletAddTokenCardProps
) => {
  const { token } = props;
  return (
    <Card className={styles.tokenCard}>
      <CardBody className={styles.cardBody}>
        <Row>
          <Col md='6'>
            <div className='d-flex'>
              {/* <img src={Icon} /> */}
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
              <Button color='link'>
                <span className='d-lg-inline'>
                  {I18n.t('containers.wallet.walletAddTokensPage.add')}
                </span>
              </Button>
            </div>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default WalletAddTokenCard;
