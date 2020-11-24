import React, { useEffect, useState } from 'react';
import { I18n } from 'react-redux-i18n';
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Col,
  Row,
} from 'reactstrap';
import { ITokenBalanceInfo } from '../../utils/interfaces';
import { filterByValueMap, getIcon } from '../../utils/utility';

import SwapSearchBar from '../SwapSearchBar';
import styles from './SwapDropdown.module.scss';

interface SwapDropdownProps {
  tokenMap: Map<string, ITokenBalanceInfo>;
  name: number;
  formState: any;
  handleDropdown: (
    hash: string,
    field1: string,
    symbol: string,
    field2: string,
    balance: string,
    field3: string
  ) => void;
  dropdownLabel: string;
}

const SwapDropdown: React.FunctionComponent<SwapDropdownProps> = (
  props: SwapDropdownProps
) => {
  const { tokenMap, handleDropdown, name, dropdownLabel } = props;
  const [tableData, settableData] = useState<any>(tokenMap);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const filteredTokensMap: any = filterByValueMap(tokenMap, searchQuery);
    settableData(filteredTokensMap);
  }, [tokenMap, searchQuery]);

  const getTokenDropdownList = (tokenMap) => {
    const popularTokenDropdownItems: any[] = [];
    const normalTokenDropdownItems: any[] = [];
    tokenMap.forEach((balanceTokenInfo: ITokenBalanceInfo, symbol: string) => {
      if (balanceTokenInfo.isPopularToken) {
        popularTokenDropdownItems.push(
          <DropdownItem
            className={styles.dropDownItem}
            key={symbol}
            name={`hash${name}`}
            value={balanceTokenInfo.hash}
            onClick={() =>
              handleDropdown(
                balanceTokenInfo.hash,
                `hash${name}`,
                symbol,
                `symbol${name}`,
                balanceTokenInfo.balance,
                `balance${name}`
              )
            }
          >
            <div className={styles.dropDownItemLeft}>
              <img
                src={getIcon(symbol)}
                height={'24px'}
                width={'24px'}
                className={styles.dropDownIcon}
              />
              {symbol}
            </div>
            <div className={styles.dropDownItemRight}>
              {balanceTokenInfo.balance}
            </div>
          </DropdownItem>
        );
      } else {
        normalTokenDropdownItems.push(
          <DropdownItem
            className={styles.dropDownItem}
            key={symbol}
            name={`hash${name}`}
            value={balanceTokenInfo.hash}
            onClick={() =>
              handleDropdown(
                balanceTokenInfo.hash,
                `hash${name}`,
                symbol,
                `symbol${name}`,
                balanceTokenInfo.balance,
                `balance${name}`
              )
            }
          >
            <div className={styles.dropDownItemLeft}>
              <img src={getIcon(symbol)} height={'24px'} width={'24px'} />
            </div>
            <div className={styles.dropDownItemRight}>
              {balanceTokenInfo.balance}
            </div>
          </DropdownItem>
        );
      }
    });
    return { popularTokenDropdownItems, normalTokenDropdownItems };
  };

  const {
    popularTokenDropdownItems,
    normalTokenDropdownItems,
  } = getTokenDropdownList(tableData);

  return (
    <UncontrolledDropdown className={styles.dropDownTokens}>
      <DropdownToggle
        caret
        color='outline-secondary'
        className={styles.buttonDropdown}
      >
        {dropdownLabel}
      </DropdownToggle>
      <DropdownMenu className={styles.dropdownMenublock}>
        <div className={styles.dropdownItemsearch}>
          <SwapSearchBar
            searching=''
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={I18n.t('containers.swap.swapPage.searchToken')}
          />
        </div>
        <div className={styles.scrollableContainer}>
          <DropdownItem header>
            {I18n.t('components.swapCard.popular')}
          </DropdownItem>
          {popularTokenDropdownItems}
          <DropdownItem header>
            {I18n.t('components.swapCard.tokens')}
          </DropdownItem>
          {normalTokenDropdownItems}
        </div>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

export default SwapDropdown;
