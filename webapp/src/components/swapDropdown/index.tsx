import React from 'react';
import { I18n } from 'react-redux-i18n';
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Col,
  Row,
} from 'reactstrap';

import SwapSearchBar from '../SwapSearchBar';
import styles from './SwapDropdown.module.scss';

interface SwapDropdownProps {
  popularTokenList: Map<string, number>;
  normalTokenList: Map<string, number>;
}

const SwapDropdown: React.FunctionComponent<SwapDropdownProps> = (
  props: SwapDropdownProps
) => {
  const { popularTokenList, normalTokenList } = props;

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
    <UncontrolledDropdown className={styles.dropDownTokens}>
      <DropdownToggle
        caret
        color='outline-secondary'
        className={styles.buttonDropdown}
      >
        {I18n.t('components.swapCard.selectAToken')}
      </DropdownToggle>
      <DropdownMenu className={styles.dropdownMenublock}>
        <DropdownItem className={styles.dropdownItemsearch}>
          <SwapSearchBar
            searching=''
            placeholder={I18n.t('containers.swap.swapPage.searchToken')}
          />
        </DropdownItem>
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
  );
};

export default SwapDropdown;
