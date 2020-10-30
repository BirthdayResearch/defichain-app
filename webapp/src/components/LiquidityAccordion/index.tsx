import React, { useState } from 'react';
import { Collapse, Button, CardBody, Card, Row, Col } from 'reactstrap';
import { MdArrowDropDown, MdArrowDropUp } from 'react-icons/md';
import { I18n } from 'react-redux-i18n';

import styles from './LiquidityAccordion.module.scss';
import DFIIcon from '../../assets/svg/icon-coin-bitcoin-lapis.svg';

interface LiquidityAccordionProps {
  poolpair: any;
}

const LiquidityAccordion: React.FunctionComponent<LiquidityAccordionProps> = (
  props: LiquidityAccordionProps
) => {
  const [collapse, setCollapse] = useState(false);

  const { poolpair } = props;

  const toggle = () => setCollapse(!collapse);

  return (
    <div>
      <Card onClick={toggle} className={styles.liquidityCard}>
        <CardBody>
          <Row>
            <Col md={2} className='text-center'>
              <img src={DFIIcon} height={'24px'} width={'24px'} />
              <img src={DFIIcon} height={'24px'} width={'24px'} />
            </Col>
            <Col md={5}>
              <span>{`${poolpair.tokenA}/${poolpair.tokenB}`}</span>
            </Col>
            <Col md={5} className='text-right'>
              {collapse ? <MdArrowDropUp /> : <MdArrowDropDown />}
            </Col>
          </Row>
        </CardBody>
      </Card>
      <Collapse isOpen={collapse}>
        {/* TODO: Problem in CSS need to fix */}
        {collapse && (
          <Card>
            <CardBody>
              <Row>
                <Col className={styles.label}>
                  {I18n.t('containers.swap.swapPage.pooled')}
                  &nbsp;
                  {`${poolpair.tokenA}`}
                </Col>
                <Col className={`${styles.unit} ${styles.text}`}>
                  {poolpair.reserveA}
                </Col>
              </Row>
              <Row>
                <Col className={styles.label}>
                  {I18n.t('containers.swap.swapPage.pooled')}
                  &nbsp;
                  {`${poolpair.tokenB}`}
                </Col>
                <Col className={`${styles.unit} ${styles.text}`}>
                  {poolpair.reserveB}
                </Col>
              </Row>
              {/* <Row>
                <Col className={styles.label}>
                  {I18n.t('containers.swap.swapPage.poolReward')}
                </Col>
                <Col className={`${styles.unit} ${styles.text}`}>
                  {'99 DFI'}
                </Col>
              </Row> */}
              <Row>
                <Col className={styles.label}>
                  {I18n.t('containers.swap.swapPage.poolShare')}
                </Col>
                <Col className={`${styles.unit} ${styles.text}`}>
                  {`${poolpair['%']} %`}
                </Col>
              </Row>
              <Row className='mt-5'>
                <Col></Col>
                <Col className='text-right'>
                  <Button color='primary'>
                    {I18n.t('containers.swap.swapPage.add')}
                  </Button>
                  <Button color='danger' className='ml-5'>
                    {I18n.t('containers.swap.swapPage.remove')}
                  </Button>
                </Col>
              </Row>
            </CardBody>
          </Card>
        )}
      </Collapse>
    </div>
  );
};

export default LiquidityAccordion;
