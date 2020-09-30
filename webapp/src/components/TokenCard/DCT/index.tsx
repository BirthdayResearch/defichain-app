import React from 'react';
import { Card, CardBody, Col, Row } from 'reactstrap';
import { I18n } from 'react-redux-i18n';

import styles from '../TokenCard.module.scss';
import { ITokenCard } from '../../../utils/interfaces';

const TokenCard: React.FunctionComponent<ITokenCard> = (props: ITokenCard) => {
  const { data } = props;

  return (
    <Card
      className={styles.tokenCard}
      onClick={() => props.handleCardClick(data.symbol, data.hash)}
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
          <Col className={styles.label}>
            {/* {I18n.t('containers.tokens.tokensPage.dctLabels.id')} */}
            {I18n.t('containers.tokens.tokensPage.dctLabels.type')}
          </Col>
          <Col className={`${styles.unit} ${styles.text}`}>
            {/* {data.id} */}
            {data.isDAT ? '' : 'DCT'}
          </Col>
        </Row>
        <Row>
          <Col className={styles.label}>
            {/* {I18n.t(
              'containers.tokens.tokensPage.dctLabels.totalInitialSupply'
            )} */}
            {I18n.t('containers.tokens.tokensPage.dctLabels.limit')}
          </Col>
          <Col className={`${styles.unit} ${styles.text}`}>
            {/* {data.totalInitialSupply} */}
            {data.limit}
          </Col>
        </Row>
        <Row>
          <Col className={styles.label}>
            {/* {I18n.t('conainers.tokens.tokensPage.dctLabels.finalSupplyLimit')} */}
            {I18n.t('conainers.tokens.tokensPage.dctLabels.decimal')}
          </Col>
          <Col className={`${styles.unit} ${styles.text}`}>
            {/* {data.finalSupplyLimit} */}
            {data.decimal}
          </Col>
        </Row>
        <Row>
          <Col className={styles.label}>
            {I18n.t('containers.tokens.tokensPage.dctLabels.mintingSupport')}
          </Col>
          <Col className={`${styles.unit} ${styles.text}`}>
            {data.mintable.toString()}
          </Col>
        </Row>
        <Row>
          <Col className={styles.label}>
            {I18n.t('containers.tokens.tokensPage.dctLabels.tradeable')}
          </Col>
          <Col className={`${styles.unit} ${styles.text}`}>
            {data.tradeable.toString()}
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default TokenCard;
