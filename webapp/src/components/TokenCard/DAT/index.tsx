import React from 'react';
import { Card, CardBody, Col, Row } from 'reactstrap';
import { I18n } from 'react-redux-i18n';

import styles from '../TokenCard.module.scss';
import { ITokenCard } from '../../../utils/interfaces';

import TokenAvatar from '../../TokenAvatar';

const TokenCard: React.FunctionComponent<ITokenCard> = (props: ITokenCard) => {
  const { data } = props;

  return (
    <Card
      className={styles.tokenCard}
      onClick={() => props.handleCardClick(data.symbol, data.hash)}
    >
      <CardBody className={styles.cardBody}>
        <Row className='mb-2'>
          <Col md='8' className='d-flex align-items-center'>
            <div>
              <span className={styles.tokenName}>
                {data.isLPS
                  ? `${I18n.t(
                      'containers.tokens.tokensPage.datLabels.datLabels'
                    )} ${data.symbolKey}`
                  : data.name}
              </span>{' '}
              <span className={styles.tokenSymbol}>{data.symbolKey}</span>
            </div>
          </Col>
          {
            <Col md='4' className={`${styles.tokenCardIcon}`}>
              <TokenAvatar
                symbol={data.symbolKey}
                size='32px'
                textSizeRatio={2}
              />
            </Col>
          }
        </Row>
        <Row>
          <Col className={styles.label}>
            {I18n.t('containers.tokens.tokensPage.datLabels.type')}
          </Col>
          <Col className={`${styles.unit} ${styles.text}`}>
            {data.isDAT ? 'DAT' : ''}
          </Col>
        </Row>
        <Row>
          <Col className={styles.label}>
            {/* {I18n.t('containers.tokens.tokensPage.datLabels.price')} */}
            {I18n.t('containers.tokens.tokensPage.datLabels.decimal')}
          </Col>
          <Col className={`${styles.unit} ${styles.text}`}>
            {data.decimal}
            {/* {data.price} */}
          </Col>
        </Row>
        <Row>
          <Col className={styles.label}>
            {/* {I18n.t('containers.tokens.tokensPage.datLabels.volume')} */}
            {I18n.t('containers.tokens.tokensPage.datLabels.limit')}
          </Col>
          <Col className={`${styles.unit} ${styles.text}`}>
            {/* {data.volume} */}
            {data.limit}
          </Col>
        </Row>
        <Row>
          <Col className={styles.label}>
            {/* {I18n.t('containers.tokens.tokensPage.datLabels.marketCap')} */}
            {I18n.t('containers.tokens.tokensPage.datLabels.mintingSupport')}
          </Col>
          <Col className={`${styles.unit} ${styles.text}`}>
            {/* {data.marketCap} */}
            {data.mintable.toString()}
          </Col>
        </Row>
        <Row>
          <Col className={styles.label}>
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
