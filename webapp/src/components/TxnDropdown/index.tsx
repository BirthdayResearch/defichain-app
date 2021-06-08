import React, { useState } from 'react';
import { MdCheck } from 'react-icons/md';
import { I18n } from 'react-redux-i18n';
import {
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Dropdown,
} from 'reactstrap';
import TokenAvatar from '../TokenAvatar';
import styles from './TxnDropdown.module.scss';

interface TxnDropdownProps {
  tokenMap: any[];
  tokenClicked: string;
  setTokenClicked: (value: string | ((prevVar: string) => string)) => void;
}

const TxnDropdown: React.FunctionComponent<TxnDropdownProps> = (
  props: TxnDropdownProps
) => {
  const { tokenMap, tokenClicked, setTokenClicked } = props;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);

  return (
    <Dropdown isOpen={dropdownOpen} toggle={toggle}>
      <DropdownToggle caret color='white'>
        {!tokenClicked ? (
          I18n.t('containers.transaction.transactionPage.all')
        ) : (
          <TokenAvatar symbol={tokenClicked} />
        )}
        &nbsp;
        {tokenClicked}
      </DropdownToggle>
      <DropdownMenu container='body'>
        <DropdownItem className={styles.dropDownDivider}>
          {!tokenClicked ? (
            I18n.t('containers.transaction.transactionPage.allAssets')
          ) : (
            <TokenAvatar symbol={tokenClicked} />
          )}
          &nbsp;
          {tokenClicked}
          <MdCheck />
        </DropdownItem>
        <DropdownItem divider />
        <div className={styles.scrollableContainer}>
          {tokenMap.map((item, index) => (
            <DropdownItem
              key={index}
              onClick={() => setTokenClicked(item.symbol)}
            >
              <TokenAvatar symbol={item.symbol} />
              &nbsp;
              {item.symbol}
            </DropdownItem>
          ))}
        </div>
      </DropdownMenu>
    </Dropdown>
  );
};

export default TxnDropdown;
