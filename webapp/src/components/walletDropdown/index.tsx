import React, { useEffect, useState } from 'react';
import { I18n } from 'react-redux-i18n';
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Col,
  Row,
  Button,
} from 'reactstrap';
import { MdAdd } from 'react-icons/md';
import { ITokenBalanceInfo } from '../../utils/interfaces';
import { filterByValueMap, getIcon } from '../../utils/utility';
import NumberMask from '../NumberMask';

import SwapSearchBar from '../SwapSearchBar';
import TokenAvatar from '../TokenAvatar';
import styles from './WalletDropdown.module.scss';
import BigNumber from 'bignumber.js';
import { DEFAULT_TOKEN_VALUE } from 'src/constants';

interface WalletDropdownProps {
  tokenMap: Map<string, ITokenBalanceInfo> | [];
  name: number;
  formState: any;
  handleDropdown: (
    hash: string,
    field1: string,
    symbol: string,
    field2: string,
    name: string
  ) => void;
  dropdownLabel: string;
  children?: React.ReactNode;
}

const WalletDropdown: React.FunctionComponent<WalletDropdownProps> = (
  props: WalletDropdownProps
) => {
  const { tokenMap, handleDropdown, name, dropdownLabel } = props;
  const [tableData, settableData] = useState<any>(tokenMap);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const filteredTokensMap: any = filterByValueMap(tokenMap, searchQuery);
    settableData(filteredTokensMap);
  }, [tokenMap, searchQuery]);

  const getTokenDropdownList = (tokenMap) => {
    const popularTokenDropdownItems: React.ReactNode[] = [];
    const normalTokenDropdownItems: React.ReactNode[] = [];

    tokenMap.forEach((balanceTokenInfo: any, symbol: string) => {
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
                balanceTokenInfo.name
              )
            }
          >
            <div className={styles.dropDownItemLeft}>
              <TokenAvatar symbol={symbol} />
              &nbsp;
              {symbol}
            </div>
            <div className={styles.dropDownItemRight}>
              <NumberMask
                value={new BigNumber(DEFAULT_TOKEN_VALUE).toFixed(8)}
              />
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
                balanceTokenInfo.name
              )
            }
          >
            <div className={styles.dropDownItemLeft}>
              <TokenAvatar symbol={symbol} />
              &nbsp;
              {symbol}
            </div>
            <div className={styles.dropDownItemRight}>
              {/* {balanceTokenInfo.balance} */}
              {new BigNumber(DEFAULT_TOKEN_VALUE).toFixed(8)}
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
        caret={!!props.children}
        color={props.children ? 'link' : 'outline-secondary'}
        className={styles.buttonDropdown}
      >
        {props.children ? (
          props.children
        ) : (
          <>
            {dropdownLabel !== I18n.t('components.swapCard.selectAToken') && (
              <TokenAvatar symbol={dropdownLabel} size='24px' />
            )}
            <span>{dropdownLabel}</span>
          </>
        )}
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
          {/* <DropdownItem header>
            {I18n.t('components.swapCard.popular')}
          </DropdownItem>

          {popularTokenDropdownItems} */}
          <DropdownItem header>
            {I18n.t('components.swapCard.tokens')}
          </DropdownItem>
          {normalTokenDropdownItems}
        </div>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

export default WalletDropdown;
