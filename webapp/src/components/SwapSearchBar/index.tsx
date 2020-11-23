import React from 'react';
import { MdSearch } from 'react-icons/md';
import { Input, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';
import styles from './SwapSearchBar.module.scss';

interface SwapSearchBarProps {
  searching: any;
  onChange: (e) => void;
  placeholder?: string;
}

const SwapSearchBar: React.FunctionComponent<SwapSearchBarProps> = (
  props: SwapSearchBarProps
) => {
  return (
    <InputGroup>
      <Input
        className={styles.searchInput}
        type='text'
        placeholder={props.placeholder}
        name='searchInput'
        id='searchInput'
        onChange={props.onChange}
      />
      <InputGroupAddon addonType='append'>
        <InputGroupText>
          <MdSearch className={styles.searchIndicator} />
        </InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  );
};

export default SwapSearchBar;
