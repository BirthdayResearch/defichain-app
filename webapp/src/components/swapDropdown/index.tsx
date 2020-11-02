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
import { filterByValue, filterByValueMap } from '../../utils/utility';

import SwapSearchBar from '../SwapSearchBar';
import styles from './SwapDropdown.module.scss';

interface SwapDropdownProps {
  tokenMap: Map<string, ITokenBalanceInfo>;
}

const SwapDropdown: React.FunctionComponent<SwapDropdownProps> = (
  props: SwapDropdownProps
) => {
  const { tokenMap } = props;
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
          <DropdownItem key={symbol}>
            <Row>
              <Col>{symbol}</Col>
              <Col className='d-flex justify-content-end'>
                {balanceTokenInfo.balance}
              </Col>
            </Row>
          </DropdownItem>
        );
      } else {
        normalTokenDropdownItems.push(
          <DropdownItem key={symbol}>
            <Row>
              <Col>{symbol}</Col>
              <Col className='d-flex justify-content-end'>
                {balanceTokenInfo.balance}
              </Col>
            </Row>
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
        {I18n.t('components.swapCard.selectAToken')}
      </DropdownToggle>
      <DropdownMenu className={styles.dropdownMenublock}>
        {/* <DropdownItem className={styles.dropdownItemsearch}> */}
        <SwapSearchBar
          searching=''
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={I18n.t('containers.swap.swapPage.searchToken')}
        />
        {/* </DropdownItem> */}
        <DropdownItem header>
          {I18n.t('components.swapCard.popular')}
          {popularTokenDropdownItems}
        </DropdownItem>
        <DropdownItem header>
          {I18n.t('components.swapCard.tokens')}
          {normalTokenDropdownItems}
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

export default SwapDropdown;
