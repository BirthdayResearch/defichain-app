import React from 'react';
import { I18n } from 'react-redux-i18n';
import { Card, CardBody, CardFooter, Input, Button } from 'reactstrap';
import classNames from 'classnames';
import { ITokenBalanceInfo } from '../../utils/interfaces';
import Loader from '../Loader';

import SwapDropdown from '../swapDropdown';
import styles from './SwapCard.module.scss';
import { BigNumber } from 'bignumber.js';

interface SwapCardProps {
  label: string;
  dropdownLabel: string;
  tokenMap: Map<string, ITokenBalanceInfo>;
  name: number;
  formState: any;
  handleChange: (e) => void;
  setMaxValue: (field: string, value: string) => void;
  isLoadingTestPoolSwapTo: boolean;
  isLoadingTestPoolSwapFrom: boolean;
  handleDropdown: (
    hash: string,
    field1: string,
    symbol: string,
    field2: string,
    balance: string,
    field3: string
  ) => void;
}

const SwapCard: React.FunctionComponent<SwapCardProps> = (
  props: SwapCardProps
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
    <Card className={styles.swapCard}>
      <CardBody className={styles.cardBody}>
        <div className={styles.labelDirection}>{label}</div>
        <div className={styles.swapInputGroup}>
          <div className={styles.inputCol}>
            {name === 1 ? (
              <Input
                className={styles.swapInput}
                type='text'
                pattern='[0-9.,]'
                inputMode='decimal'
                placeholder={I18n.t('components.swapCard.inputLabel')}
                name={`amount${name}`}
                id='input'
                value={formState[`amount${name}`]}
                onChange={(e) => {
                  if (new BigNumber(e?.target?.value || 0).gte(0)) {
                    handleChange(e);
                  }
                }}
                disabled={!formState[`hash${name}`]}
              />
            ) : (
              <Input
                className={styles.swapInput}
                type='text'
                pattern='[0-9.,]'
                inputMode='decimal'
                placeholder={I18n.t('components.swapCard.inputLabel')}
                name={`amount${name}`}
                id='input'
                value={formState[`amount${name}`]}
                onChange={(e) => {
                  if (new BigNumber(e?.target?.value || 0).gte(0)) {
                    handleChange(e);
                  }
                }}
                disabled={!formState[`hash${name}`]}
              />
            )}
          </div>
          <div className={styles.dropDownCol}>
            <SwapDropdown
              tokenMap={tokenMap}
              name={name}
              formState={formState}
              handleDropdown={handleDropdown}
              dropdownLabel={dropdownLabel}
            />
          </div>
        </div>
      </CardBody>
      <CardFooter className={styles.cardFooter}>
        <div className={styles.cardFooterBalance}>
          <span className={styles.labelBalance}>
            {I18n.t('components.swapCard.balance')}
          </span>
          : {formState[`balance${name}`] || '0'}
        </div>
        <div className={styles.cardFooterActions}>
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
        </div>
      </CardFooter>
    </Card>
  );
};

export default SwapCard;
