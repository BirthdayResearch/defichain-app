import React from 'react';
import { Card, CardBody, Col, Row } from 'reactstrap';
import { I18n } from 'react-redux-i18n';

import styles from '../TokenCard.module.scss';

interface TokenCardProps {
  data: {
    name: string;
    symbol: string;
    isDAT: boolean;
    decimal: number;
    limit: number;
    mintable: boolean;
    tradeable: boolean;
    // icon: any;
    // type: string;
    // price: string;
    // volume: string;
    // marketCap: string;
    // holders: string;
  };
  handleCardClick: (symbol: string) => void;
}

const TokenCard: React.FunctionComponent<TokenCardProps> = (
  props: TokenCardProps
) => {
  const { data } = props;

  return (
    <Card
      className={styles.tokenCard}
      onClick={() => props.handleCardClick(data.symbol)}
    >
      <CardBody className={styles.cardBody}>
        <Row className='mb-3'>
          <Col>
            <b>{data.name}</b> <span>{data.symbol}</span>
          </Col>

          {/* {
            <Col md='6' className={`${styles.tokenCardIcon}`}>
              <img src={data.icon} />
            </Col>
          } */}
        </Row>
        <Row>
          <Col className={`${styles.label}`}>
            {I18n.t('containers.tokens.tokensPage.datLabels.type')}
          </Col>
          <Col className={`${styles.unit} ${styles.text}`}>
            {data.isDAT ? 'DAT' : ''}
          </Col>
        </Row>
        <Row>
          <Col className={`${styles.label}`}>
            {/* {I18n.t('containers.tokens.tokensPage.datLabels.price')} */}
            {I18n.t('containers.tokens.tokensPage.datLabels.decimal')}
          </Col>
          <Col className={`${styles.unit} ${styles.text}`}>
            {data.decimal}
            {/* {data.price} */}
          </Col>
        </Row>
        <Row>
          <Col className={`${styles.label}`}>
            {/* {I18n.t('containers.tokens.tokensPage.datLabels.volume')} */}
            {I18n.t('containers.tokens.tokensPage.datLabels.limit')}
          </Col>
          <Col className={`${styles.unit} ${styles.text}`}>
            {/* {data.volume} */}
            {data.limit}
          </Col>
        </Row>
        <Row>
          <Col className={`${styles.label}`}>
            {/* {I18n.t('containers.tokens.tokensPage.datLabels.marketCap')} */}
            {I18n.t('containers.tokens.tokensPage.datLabels.mintingSupport')}
          </Col>
          <Col className={`${styles.unit} ${styles.text}`}>
            {/* {data.marketCap} */}
            {data.mintable.toString()}
          </Col>
        </Row>
        <Row>
          <Col className={`${styles.label}`}>
            {/* {I18n.t('containers.tokens.tokensPage.datLabels.holders')} */}
            {I18n.t('containers.tokens.tokensPage.datLabels.tradeable')}
          </Col>
          <Col className={`${styles.unit} ${styles.text}`}>
            {/* {data.holders} */}
            {data.tradeable.toString()}
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default TokenCard;
