import React, { useEffect } from 'react';
import { Row, Col } from 'reactstrap';
import { MdCompareArrows } from 'react-icons/md';
import { I18n } from 'react-redux-i18n';

import SwapCard from '../../../../components/SwapCard';
import { fetchPoolsharesRequest } from '../../reducer';
import styles from './swapTab.module.scss';
import { ITokenBalanceInfo } from '../../../../utils/interfaces';

interface SwapTabProps {
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
  filterBySymbol: any;
  isLoadingTestPoolSwap: boolean;
}

const SwapTab: React.FunctionComponent<SwapTabProps> = (
  props: SwapTabProps
) => {
  const {
    formState,
    handleChange,
    handleDropdown,
    setMaxValue,
    filterBySymbol,
    isLoadingTestPoolSwap,
  } = props;

  useEffect(() => {
    fetchPoolsharesRequest();
  }, []);

  return (
    <>
      <div>
        <section>
          <div className={styles.swapRow}>
            <SwapCard
              label={I18n.t('containers.swap.swapTab.from')}
              tokenMap={filterBySymbol(`symbol${2}`, !!formState.symbol2)}
              name={1}
              formState={formState}
              handleChange={handleChange}
              handleDropdown={handleDropdown}
              setMaxValue={setMaxValue}
              isLoadingTestPoolSwap={isLoadingTestPoolSwap}
              dropdownLabel={
                formState.symbol1
                  ? formState.symbol1
                  : I18n.t('components.swapCard.selectAToken')
              }
            />
            <div className={styles.swapDirection}>
              <MdCompareArrows />
            </div>
            <SwapCard
              label={I18n.t('containers.swap.swapTab.to')}
              tokenMap={filterBySymbol(`symbol${1}`, !!formState.symbol1)}
              name={2}
              formState={formState}
              handleChange={handleChange}
              handleDropdown={handleDropdown}
              setMaxValue={setMaxValue}
              isLoadingTestPoolSwap={isLoadingTestPoolSwap}
              dropdownLabel={
                formState.symbol2
                  ? formState.symbol2
                  : I18n.t('components.swapCard.selectAToken')
              }
            />
          </div>
        </section>
      </div>
    </>
  );
};

export default SwapTab;
