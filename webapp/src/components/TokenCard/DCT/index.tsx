import React from 'react';
import { Card, CardBody, Col, Row } from 'reactstrap';
import { I18n } from 'react-redux-i18n';

import styles from '../TokenCard.module.scss';

interface TokenCardProps {
  data: {
    name: string;
    icon: any;
    symbol: string;
    id: string;
    totalInitialSupply: string;
    finalSupplyLimit: string;
    mintingSupport: string;
    tradeable: string;
  };
  handleCardClick: any;
}

const TokenCard: React.FunctionComponent<TokenCardProps> = (
  props: TokenCardProps
) => {
  const { data } = props;

  return (
    <Card className={styles.tokenCard} onClick={() => props.handleCardClick()}>
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
            {I18n.t('containers.tokens.tokensPage.dctLabels.id')}
          </Col>
          <Col
            className={styles.unit}
            style={{ textAlign: 'end', lineHeight: '1.5rem' }}
          >
            {data.id}
          </Col>
        </Row>
        <Row>
          <Col className={`${styles.label}`}>
            {I18n.t(
              'containers.tokens.tokensPage.dctLabels.totalInitialSupply'
            )}
          </Col>
          <Col
            className={styles.unit}
            style={{ textAlign: 'end', lineHeight: '1.5rem' }}
          >
            {data.totalInitialSupply}
          </Col>
        </Row>
        <Row>
          <Col className={`${styles.label}`}>
            {I18n.t('containers.tokens.tokensPage.dctLabels.finalSupplyLimit')}
          </Col>
          <Col
            className={styles.unit}
            style={{ textAlign: 'end', lineHeight: '1.5rem' }}
          >
            {data.finalSupplyLimit}
          </Col>
        </Row>
        <Row>
          <Col className={`${styles.label}`}>
            {I18n.t('containers.tokens.tokensPage.dctLabels.mintingSupport')}
          </Col>
          <Col
            className={styles.unit}
            style={{ textAlign: 'end', lineHeight: '1.5rem' }}
          >
            {data.mintingSupport}
          </Col>
        </Row>
        <Row>
          <Col className={`${styles.label}`}>
            {I18n.t('containers.tokens.tokensPage.dctLabels.tradeable')}
          </Col>
          <Col
            className={styles.unit}
            style={{ textAlign: 'end', lineHeight: '1.5rem' }}
          >
            {data.tradeable}
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default TokenCard;
