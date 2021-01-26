import React from 'react';
import { CardBody, Card, Row, Col } from 'reactstrap';
import { I18n } from 'react-redux-i18n';

import styles from './LiquidityAccordion.module.scss';
import { LIQUIDITY_INFO_BASE_PATH } from '../../constants';
import PairIcon from '../PairIcon';
import NumberMask from '../NumberMask';
import BigNumber from 'bignumber.js';

interface LiquidityAccordionProps {
  history: any;
  poolpair: any;
}

const LiquidityAccordion: React.FunctionComponent<LiquidityAccordionProps> = (
  props: LiquidityAccordionProps
) => {
  const { poolpair } = props;

  const liquidityAmount = (percentage, reserve) => {
    return new BigNumber(percentage || 0).div(100).times(reserve).toFixed(8);
  };

  return (
    <div>
      <Card
        onClick={() => {
          props.history.push(`${LIQUIDITY_INFO_BASE_PATH}/${poolpair.poolID}`);
        }}
        className={`${styles.liquidityCard} mb-4`}
      >
        <CardBody>
          <Row className='align-items-center'>
            <Col md={2}>
              <PairIcon poolpair={poolpair} />
            </Col>
            <Col md={5}>
              <span>{`${poolpair.tokenA}-${poolpair.tokenB}`}</span>
            </Col>
            <Col md={5} className='text-right'>
              {/* <UncontrolledDropdown>
                <DropdownToggle color='link' size='md'>
                  <MdMoreHoriz />
                </DropdownToggle>
                <DropdownMenu right>
                  {liquidityCardMenu.map((data) => {
                    return (
                      <DropdownItem
                        className='justify-content-between'
                        key={data.value}
                        value={data.value}
                        onClick={() => handleDropDowns(data.value, poolpair)}
                      >
                        <span>{I18n.t(data.label)}</span>
                      </DropdownItem>
                    );
                  })}
                </DropdownMenu>
              </UncontrolledDropdown> */}
            </Col>
          </Row>
          <br />
          <Row>
            <Col className={styles.bigLabel}>
              {I18n.t('containers.swap.swapPage.apy')}
            </Col>
            <Col className={styles.bigValue}>{`${poolpair.apy}%`}</Col>
          </Row>
          <Row>
            <Col className={styles.label}>
              {I18n.t('containers.swap.swapPage.pooled')} {`${poolpair.tokenA}`}
            </Col>
            <Col className={styles.value}>
              <NumberMask
                value={liquidityAmount(
                  poolpair.poolSharePercentage,
                  poolpair.reserveA
                )}
              />
            </Col>
          </Row>
          <Row>
            <Col className={styles.label}>
              {I18n.t('containers.swap.swapPage.pooled')} {`${poolpair.tokenB}`}
            </Col>
            <Col className={styles.value}>
              <NumberMask
                value={liquidityAmount(
                  poolpair.poolSharePercentage,
                  poolpair.reserveB
                )}
              />
            </Col>
          </Row>
          <Row>
            <Col className={styles.label}>
              {I18n.t('containers.swap.swapPage.poolShare')}
            </Col>
            <Col className={styles.value}>
              {`${new BigNumber(poolpair.poolSharePercentage).toFixed(8)}%`}
            </Col>
          </Row>
        </CardBody>
      </Card>
    </div>
  );
};

export default LiquidityAccordion;
