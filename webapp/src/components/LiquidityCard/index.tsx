import React from 'react';
import { I18n } from 'react-redux-i18n';
import {
  Row,
  Card,
  CardBody,
  CardFooter,
  Col,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

import styles from './LiquidityCard.module.scss';

interface LiquidityCardProps {
  label: string;
  balance: number;
  amount: number;
  popularTokenList: string[];
  normalTokenList: string[];
}

const LiquidityCard: React.FunctionComponent<LiquidityCardProps> = (
  props: LiquidityCardProps
) => {
  const { label, balance, amount, popularTokenList, normalTokenList } = props;

  return (
    <Card className={styles.liquidityCard}>
      <CardBody className={styles.cardBody}>
        <Row>
          <Col className={styles.labelDirection}>{label}</Col>
        </Row>
        <Row>
          <Col className='mt-2'>{amount}</Col>
          <Col>
            <UncontrolledDropdown>
              <DropdownToggle caret color='outline-secondary'>
                {I18n.t('components.swapCard.selectAToken')}
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem header>
                  {I18n.t('components.swapCard.popular')}
                  {popularTokenList.map((token) => (
                    <DropdownItem>{token}</DropdownItem>
                  ))}
                </DropdownItem>
                <DropdownItem header>
                  {I18n.t('components.swapCard.tokens')}
                  {normalTokenList.map((token) => (
                    <DropdownItem>{token}</DropdownItem>
                  ))}
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Col>
        </Row>
      </CardBody>
      <CardFooter>
        <Row>
          <Col>
            <span className={styles.labelBalance}>
              {I18n.t('components.swapCard.balance')}
            </span>
            : {balance}
          </Col>
          <Col className={styles.colorMax}>
            {I18n.t('components.swapCard.max')}
          </Col>
        </Row>
      </CardFooter>
    </Card>
  );
};

export default LiquidityCard;
