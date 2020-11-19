import React from 'react';
import { MdSearch } from 'react-icons/md';
import { Col, FormGroup, Input, InputGroup } from 'reactstrap';
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
    <FormGroup className={`row ${styles.formGroup}`}>
      <Col>
        <InputGroup>
          <Input
            type='text'
            placeholder={props.placeholder}
            name='searchInput'
            id='searchInput'
            onChange={props.onChange}
          />
          <MdSearch className={styles.searchIndicator} />
        </InputGroup>
      </Col>
    </FormGroup>
  );
};

export default SwapSearchBar;
