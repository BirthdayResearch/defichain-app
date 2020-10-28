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
  popularTokenList: Map<string, number>;
  normalTokenList: Map<string, number>;
}

const LiquidityCard: React.FunctionComponent<LiquidityCardProps> = (
  props: LiquidityCardProps
) => {
  const { label, balance, amount, popularTokenList, normalTokenList } = props;

  const getTokenDropdownList = (TokenList) => {
    const TokenDropdownItems: any[] = [];
    TokenList.forEach((balance: number, symbol: string) => {
      TokenDropdownItems.push(
        <DropdownItem key={symbol}>
          <Row>
            <Col>{symbol}</Col>
            <Col className='d-flex justify-content-end'>{balance}</Col>
          </Row>
        </DropdownItem>
      );
    });
    return TokenDropdownItems;
  };

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
                  {getTokenDropdownList(popularTokenList)}
                </DropdownItem>
                <DropdownItem header>
                  {I18n.t('components.swapCard.tokens')}
                  {getTokenDropdownList(normalTokenList)}
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
