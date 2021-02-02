import React from 'react';
import { Button, Col, Row } from 'reactstrap';
import { MdCompareArrows } from 'react-icons/md';
import { I18n } from 'react-redux-i18n';

import SwapCard from '../../../../components/SwapCard';
import styles from './swapTab.module.scss';
import { ITokenBalanceInfo } from '../../../../utils/interfaces';
import AddressDropdown from '../../../../components/AddressDropdown';
import { getTransactionAddressLabel } from '../../../../utils/utility';

interface SwapTabProps {
  handleAddressDropdown?: any;
  label: string;
  dropdownLabel: string;
  tokenMap: Map<string, ITokenBalanceInfo>;
  name: number;
  formState: any;
  handleChangeFrom: (e) => void;
  handleChangeTo: (e) => void;
  handleInterchange: () => void;
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
  isLoadingTestPoolSwapTo: boolean;
  isLoadingTestPoolSwapFrom: boolean;
}

const SwapTab: React.FunctionComponent<SwapTabProps> = (
  props: SwapTabProps
) => {
  const {
    handleAddressDropdown,
    formState,
    handleChangeFrom,
    handleChangeTo,
    handleDropdown,
    setMaxValue,
    filterBySymbol,
    isLoadingTestPoolSwapTo,
    isLoadingTestPoolSwapFrom,
    handleInterchange,
  } = props;

  const getTransactionLabel = (formState: any) => {
    return getTransactionAddressLabel(
      formState.receiveLabel,
      formState.receiveAddress,
      I18n.t('containers.swap.swapTab.receiveAddress')
    );
  };

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
              handleChange={handleChangeFrom}
              handleDropdown={handleDropdown}
              setMaxValue={setMaxValue}
              isLoadingTestPoolSwapTo={isLoadingTestPoolSwapTo}
              isLoadingTestPoolSwapFrom={isLoadingTestPoolSwapFrom}
              dropdownLabel={
                formState.symbol1
                  ? formState.symbol1
                  : I18n.t('components.swapCard.selectAToken')
              }
            />
            <Button
              disabled={!formState.hash1 || !formState.hash2}
              onClick={handleInterchange}
              color='link'
              size='sm'
            >
              <MdCompareArrows />
            </Button>
            <SwapCard
              label={I18n.t('containers.swap.swapTab.to')}
              tokenMap={filterBySymbol(`symbol${1}`, !!formState.symbol1)}
              name={2}
              formState={formState}
              handleChange={handleChangeTo}
              handleDropdown={handleDropdown}
              setMaxValue={setMaxValue}
              isLoadingTestPoolSwapTo={isLoadingTestPoolSwapTo}
              isLoadingTestPoolSwapFrom={isLoadingTestPoolSwapFrom}
              dropdownLabel={
                formState.symbol2
                  ? formState.symbol2
                  : I18n.t('components.swapCard.selectAToken')
              }
            />
          </div>
          <br />
          <Row>
            <Col md='4' className={styles.keyValueLiKey}>
              <span>{I18n.t('containers.swap.swapTab.receiveTokensAt')}</span>
            </Col>
            <Col md='8'>
              <AddressDropdown
                formState={formState}
                getTransactionLabel={getTransactionLabel}
                onSelectAddress={handleAddressDropdown}
              />
            </Col>
          </Row>
        </section>
      </div>
    </>
  );
};

export default SwapTab;
