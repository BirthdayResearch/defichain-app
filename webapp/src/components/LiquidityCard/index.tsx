import React from 'react';
import { I18n } from 'react-redux-i18n';
import {
  Row,
  Card,
  CardBody,
  CardFooter,
  Col,
  FormGroup,
  Input,
  Label,
  Button,
} from 'reactstrap';
import { ITokenBalanceInfo } from '../../utils/interfaces';

import SwapDropdown from '../swapDropdown';
import styles from './LiquidityCard.module.scss';

interface LiquidityCardProps {
  label: string;
  dropdownLabel: string;
  tokenMap: Map<string, ITokenBalanceInfo>;
  name: number;
  formState: any;
  handleChange: (e) => void;
  setMaxValue: (field: string, value: string) => void;
  handleDropdown: (
    hash: string,
    field1: string,
    symbol: string,
    field2: string,
    balance: string,
    field3: string
  ) => void;
}

const LiquidityCard: React.FunctionComponent<LiquidityCardProps> = (
  props: LiquidityCardProps
) => {
  const {
    label,
    tokenMap,
    name,
    formState,
    handleChange,
    handleDropdown,
    dropdownLabel,
    setMaxValue,
  } = props;

  return (
    <Card className={styles.liquidityCard}>
      <CardBody className={styles.cardBody}>
        <Row>
          <Col className={styles.labelDirection}>{label}</Col>
        </Row>
        <Row>
          <Col className='mt-2'>
            {name === 1 ? (
              <FormGroup className='form-label-group'>
                <Input
                  type='number'
                  placeholder={I18n.t('components.swapCard.inputLabel')}
                  name={`amount${name}`}
                  id='input'
                  value={formState[`amount${name}`]}
                  onChange={(e) => {
                    if (Number(e.target.value) >= 0) {
                      handleChange(e);
                    }
                  }}
                  disabled={!formState[`hash${name}`] || !formState[`hash2`]}
                />
                <Label for='message'>
                  {I18n.t('components.swapCard.inputLabel')}
                </Label>
              </FormGroup>
            ) : (
              <div className='mt-2'>{formState[`amount2`]}</div>
            )}
          </Col>
          <Col className={styles.dropDownCol}>
            <SwapDropdown
              tokenMap={tokenMap}
              name={name}
              formState={formState}
              handleDropdown={handleDropdown}
              dropdownLabel={dropdownLabel}
            />
          </Col>
        </Row>
      </CardBody>
      <CardFooter>
        <Row>
          <Col md='8'>
            <span className={styles.labelBalance}>
              {I18n.t('components.swapCard.balance')}
            </span>
            : {formState[`balance${name}`] || '-'}
          </Col>
          <Col className='text-right' md='4'>
            {name === 1 && (
              <Button
                color='link'
                size='sm'
                disabled={!formState[`hash${name}`] || !formState[`hash2`]}
                onClick={() =>
                  setMaxValue(`amount${name}`, formState[`balance${name}`])
                }
              >
                {I18n.t('components.swapCard.max')}
              </Button>
            )}
          </Col>
        </Row>
      </CardFooter>
    </Card>
  );
};

export default LiquidityCard;
