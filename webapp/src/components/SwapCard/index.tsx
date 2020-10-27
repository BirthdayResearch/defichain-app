import React, { useState } from 'react';
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
  Input,
} from 'reactstrap';
import styles from './SwapCard.module.scss';

interface SwapCardProps {
  label: string;
  isFrom: boolean;
  balance: number;
  popularTokenList: string[];
  normalTokenList: string[];
}

const SwapCard: React.FunctionComponent<SwapCardProps> = (
  props: SwapCardProps
) => {
  const { isFrom, label, balance, popularTokenList, normalTokenList } = props;

  const [fromAmount, setFromAmount] = useState(0);

  const onInputChange = (e) => {
    setFromAmount(e.target.value);
  };

  // temporary condition, need to update
  const amount = isFrom ? fromAmount : Number(fromAmount) * 10 || 0;

  return (
    <Card className={styles.swapCard}>
      <CardBody className={styles.cardBody}>
        <Row>
          <Col className={styles.labelDirection}>{label}</Col>
        </Row>
        <Row>
          <Col className='mt-2'>
            {isFrom ? (
              <Input
                className='border-0'
                type='text'
                value={amount}
                onChange={onInputChange}
              ></Input>
            ) : (
              amount
            )}
          </Col>
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
          {isFrom && (
            <Col className={styles.colorMax}>
              {I18n.t('components.swapCard.max')}
            </Col>
          )}
        </Row>
      </CardFooter>
    </Card>
  );
};

export default SwapCard;
