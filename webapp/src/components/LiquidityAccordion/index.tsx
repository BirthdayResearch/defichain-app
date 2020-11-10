import React, { useState } from 'react';
import {
  CardBody,
  Card,
  Row,
  Col,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { MdMoreHoriz } from 'react-icons/md';
import { I18n } from 'react-redux-i18n';

import styles from './LiquidityAccordion.module.scss';
import { getIcon } from '../../utils/utility';
import { CREATE_POOL_PAIR_PATH, ADD, REMOVE } from '../../constants';

interface LiquidityAccordionProps {
  history: any;
  poolpair: any;
}

const LiquidityAccordion: React.FunctionComponent<LiquidityAccordionProps> = (
  props: LiquidityAccordionProps
) => {
  const { history } = props;
  const liquidityCardMenu = [
    {
      label: I18n.t('containers.swap.swapPage.add'),
      value: ADD,
    },
    {
      label: I18n.t('containers.swap.swapPage.remove'),
      value: REMOVE,
    },
  ];

  const handleDropDowns = (data: string) => {
    if (data === ADD) {
      history.push(`${CREATE_POOL_PAIR_PATH}`);
    } else {
    }
  };

  const [collapse, setCollapse] = useState(false);

  const { poolpair } = props;

  const toggle = () => setCollapse(!collapse);

  return (
    <div>
      <Card onClick={toggle} className={`${styles.liquidityCard} mb-5`}>
        <CardBody>
          <Row className='align-items-center'>
            <Col md={2} className={styles.imgDesign}>
              <img
                src={getIcon(poolpair.tokenA)}
                height={'24px'}
                width={'24px'}
              />
              <img
                src={getIcon(poolpair.tokenB)}
                height={'24px'}
                width={'24px'}
              />
            </Col>
            <Col md={5}>
              <span>{`${poolpair.tokenA}/${poolpair.tokenB}`}</span>
            </Col>
            <Col md={5} className='text-right'>
              <UncontrolledDropdown>
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
                        onClick={() => handleDropDowns(data.value)}
                      >
                        <span>{I18n.t(data.label)}</span>
                      </DropdownItem>
                    );
                  })}
                </DropdownMenu>
              </UncontrolledDropdown>
            </Col>
          </Row>
          <br />
          <Row>
            <Col className={styles.apy}>
              {I18n.t('containers.swap.swapPage.apy')}
            </Col>
            <Col className={`${styles.apyValue} ${styles.text}`}>
              {poolpair.reserveA}
            </Col>
          </Row>
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
          <Row>
            <Col className={styles.label}>
              {I18n.t('containers.swap.swapPage.poolShare')}
            </Col>
            <Col className={`${styles.unit} ${styles.text}`}>
              {`${poolpair.poolSharePercentage} %`}
            </Col>
          </Row>
        </CardBody>
      </Card>
    </div>
  );
};

export default LiquidityAccordion;
