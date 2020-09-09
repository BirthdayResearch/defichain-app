import React from 'react';
import { Card, CardBody, Col, Row } from 'reactstrap';
import { I18n } from 'react-redux-i18n';

import styles from '../TokenCard.module.scss';

interface TokenCardProps {
  data: {
    name: string;
    // icon: any;
    symbol: string;
    // id: string;
    // totalInitialSupply: string;
    // finalSupplyLimit: string;
    decimal: string;
    limit: number;
    mintable: string;
    tradeable: string;
    isDAT: boolean;
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
          {/* {
            <Col md='6' className={`${styles.tokenCardIcon}`}>
              <img src={data.icon} />
            </Col>
          } */}
        </Row>
        <br />
        <Row>
          <Col className={`${styles.label}`}>
            {/* {I18n.t('containers.tokens.tokensPage.dctLabels.id')} */}
            {I18n.t('containers.tokens.tokensPage.dctLabels.type')}
          </Col>
          <Col
            className={styles.unit}
            style={{ textAlign: 'end', lineHeight: '1.5rem' }}
          >
            {/* {data.id} */}
            {data.isDAT ? '' : 'DCT'}
          </Col>
        </Row>
        <Row>
          <Col className={`${styles.label}`}>
            {/* {I18n.t(
              'containers.tokens.tokensPage.dctLabels.totalInitialSupply'
            )} */}
            {I18n.t('containers.tokens.tokensPage.dctLabels.limit')}
          </Col>
          <Col
            className={styles.unit}
            style={{ textAlign: 'end', lineHeight: '1.5rem' }}
          >
            {/* {data.totalInitialSupply} */}
            {data.limit}
          </Col>
        </Row>
        <Row>
          <Col className={`${styles.label}`}>
            {/* {I18n.t('conainers.tokens.tokensPage.dctLabels.finalSupplyLimit')} */}
            {I18n.t('conainers.tokens.tokensPage.dctLabels.decimal')}
          </Col>
          <Col
            className={styles.unit}
            style={{ textAlign: 'end', lineHeight: '1.5rem' }}
          >
            {/* {data.finalSupplyLimit} */}
            {data.decimal}
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
            {data.mintable.toString()}
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
            {data.tradeable.toString()}
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default TokenCard;
