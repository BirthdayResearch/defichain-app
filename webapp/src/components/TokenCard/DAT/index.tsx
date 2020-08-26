import React from 'react';
import { Card, CardBody, Col, Row } from 'reactstrap';
import { I18n } from 'react-redux-i18n';

import styles from '../TokenCard.module.scss';

interface TokenCardProps {
  data: {
    name: string;
    icon: any;
    symbol: string;
    type: string;
    price: string;
    volume: string;
    marketCap: string;
    holders: string;
  };
  handleCardClick: any;
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
        <Row>
          <Col>
            <b>{data.name}</b> {data.symbol}
          </Col>
          {
            <Col md='6' className={`${styles.tokenCardIcon}`}>
              <img src={data.icon} />
            </Col>
          }
        </Row>
        <br />
        <Row>
          <Col className={`${styles.label}`}>
            {I18n.t('containers.tokens.tokensPage.datLabels.type')}
          </Col>
          <Col
            className={styles.unit}
            style={{ textAlign: 'end', lineHeight: '1.5rem' }}
          >
            {data.type}
          </Col>
        </Row>
        <Row>
          <Col className={`${styles.label}`}>
            {I18n.t('containers.tokens.tokensPage.datLabels.price')}
          </Col>
          <Col
            className={styles.unit}
            style={{ textAlign: 'end', lineHeight: '1.5rem' }}
          >
            {data.price}
          </Col>
        </Row>
        <Row>
          <Col className={`${styles.label}`}>
            {I18n.t('containers.tokens.tokensPage.datLabels.volume')}
          </Col>
          <Col
            className={styles.unit}
            style={{ textAlign: 'end', lineHeight: '1.5rem' }}
          >
            {data.volume}
          </Col>
        </Row>
        <Row>
          <Col className={`${styles.label}`}>
            {I18n.t('containers.tokens.tokensPage.datLabels.marketCap')}
          </Col>
          <Col
            className={styles.unit}
            style={{ textAlign: 'end', lineHeight: '1.5rem' }}
          >
            {data.marketCap}
          </Col>
        </Row>
        <Row>
          <Col className={`${styles.label}`}>
            {I18n.t('containers.tokens.tokensPage.datLabels.holders')}
          </Col>
          <Col
            className={styles.unit}
            style={{ textAlign: 'end', lineHeight: '1.5rem' }}
          >
            {data.holders}
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default TokenCard;
