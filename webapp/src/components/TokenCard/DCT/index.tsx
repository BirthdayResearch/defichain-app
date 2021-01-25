import React from 'react';
import { Card, CardBody, Col, Row } from 'reactstrap';
import { I18n } from 'react-redux-i18n';

import styles from '../TokenCard.module.scss';
import { ITokenCard } from '../../../utils/interfaces';
import VerifiedIcon from '../../../assets/svg/verified-icon.svg';

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
                      'containers.tokens.tokensPage.dctLabels.liquidityTokenFor'
                    )} ${data.symbolKey}`
                  : data.name}
              </span>{' '}
              <span className={styles.tokenSymbol}>{data.symbolKey}</span>
            </div>
          </Col>
          <Col md='4' className={`${styles.tokenCardIcon}`}>
            {data.isDAT && (
              <img src={VerifiedIcon} className={styles.verifiedIcon} />
            )}
            <TokenAvatar
              symbol={data.symbolKey}
              size='32px'
              textSizeRatio={2}
            />
          </Col>
        </Row>
        {/* <Row>
          <Col className={styles.label}>
            {I18n.t('containers.tokens.tokensPage.dctLabels.type')}
          </Col>
          <Col className={`${styles.unit} ${styles.text}`}>
            {data.isDAT ? '' : 'DCT'}
          </Col>
        </Row> */}
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
            {/* {I18n.t('containers.tokens.tokensPage.dctLabels.finalSupplyLimit')} */}
            {I18n.t('containers.tokens.tokensPage.dctLabels.decimal')}
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
