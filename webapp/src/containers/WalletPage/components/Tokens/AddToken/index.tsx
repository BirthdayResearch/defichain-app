// Not in use component. Don't delete it for future purposes

import React, { useState, useEffect } from 'react';
import { NavLink as RRNavLink } from 'react-router-dom';
import { I18n } from 'react-redux-i18n';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { MdSearch, MdArrowBack } from 'react-icons/md';
import cloneDeep from 'lodash/cloneDeep';
import { Button, FormGroup, Col, InputGroup, Input } from 'reactstrap';

import Pagination from '../../../../../components/Pagination';
import WalletAddTokenCard from '../../../../../components/TokenCard/WalletAddTokenCard';
import styles from '../../../WalletPage.module.scss';
import { fetchTokensRequest } from '../../../reducer';
import { filterByValue, getPageTitle } from '../../../../../utils/utility';
import {
  WALLET_TOKENS_PATH,
  TOKEN_LIST_PAGE_SIZE,
  DESTRUCTION_TX,
} from '../../../../../constants';
import Header from '../../../../HeaderComponent';

interface TokensProps {
  tokens: any;
  fetchTokensRequest: () => void;
}

const WalletAddToken: React.FunctionComponent<TokensProps> = (
  props: TokensProps
) => {
  const defaultPage = 1;
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [tableData, settableData] = useState([]);
  const [currentPage, setCurrentPage] = useState<number>(defaultPage);
  const pageSize = TOKEN_LIST_PAGE_SIZE;
  const { tokens, fetchTokensRequest } = props;
  const total = tokens.length;
  const pagesCount = Math.ceil(total / pageSize);
  const from = (currentPage - 1) * pageSize;
  const to = Math.min(total, currentPage * pageSize);

  const filteredTokens = tokens.filter(
    (data) => !data.isDAT && data.destructionTx === DESTRUCTION_TX
  );

  function paginate(pageNumber, tokensList?: any[]) {
    const clone = cloneDeep(tokensList || filteredTokens);
    const tableData = clone.slice(
      (pageNumber - 1) * pageSize,
      pageNumber * pageSize
    );
    setCurrentPage(pageNumber);
    settableData(tableData);
  }

  useEffect(() => {
    if (!searchQuery) {
      paginate(currentPage);
    } else {
      const tokensList: any[] = filterByValue(filteredTokens, searchQuery);
      paginate(defaultPage, tokensList);
    }
  }, [filteredTokens, searchQuery]);

  useEffect(() => {
    fetchTokensRequest();
  }, []);

  return (
    <div className='main-wrapper'>
      <Helmet>
        <title>
          {getPageTitle(
            I18n.t('containers.wallet.walletAddTokensPage.walletAddTokens')
          )}
        </title>
      </Helmet>
      <Header>
        <Button
          to={WALLET_TOKENS_PATH}
          tag={RRNavLink}
          color='link'
          className='header-bar-back'
        >
          <MdArrowBack />
          <span className='d-lg-inline'>
            {I18n.t('containers.wallet.walletAddTokensPage.back')}
          </span>
        </Button>
        <h1>
          {I18n.t('containers.wallet.walletAddTokensPage.addWalletLabel')}
        </h1>
      </Header>
      <div className='content'>
        <div>
          <FormGroup className={`row ${styles.formGroup}`}>
            <Col>
              <InputGroup>
                <Input
                  type='text'
                  placeholder={'Search Tokens'}
                  name='searchInput'
                  id='searchInput'
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <MdSearch className={styles.searchIndicator} />
              </InputGroup>
            </Col>
          </FormGroup>
        </div>
        {tableData.map((token) => (
          <WalletAddTokenCard token={token} />
        ))}
        <Pagination
          label={I18n.t('containers.wallet.walletPage.walletPaginationRange', {
            to,
            total,
            from: from + 1,
          })}
          currentPage={currentPage}
          pagesCount={pagesCount}
          handlePageClick={paginate}
        />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  const { tokens, isTokensLoaded, isLoadingTokens } = state.wallet;
  return {
    tokens,
    isTokensLoaded,
    isLoadingTokens,
  };
};

const mapDispatchToProps = {
  fetchTokensRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(WalletAddToken);
