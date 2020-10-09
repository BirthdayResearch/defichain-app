import React, { useState, useEffect } from 'react';
import { NavLink as RRNavLink, RouteComponentProps } from 'react-router-dom';
import { I18n } from 'react-redux-i18n';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { MdAdd } from 'react-icons/md';
import { Button, ButtonGroup } from 'reactstrap';
import cloneDeep from 'lodash/cloneDeep';

import {
  fetchTokensRequest,
  fetchAccountTokensRequest,
} from '../../../reducer';
import { filterByValue } from '../../../../../utils/utility';
import {
  WALLET_ADD_TOKEN_PATH,
  WALLET_PAGE_PATH,
  TOKEN_LIST_PAGE_SIZE,
  DESTRUCTION_TX,
} from '../../../../../constants';
import WalletTokenCard from '../../../../../components/TokenCard/WalletTokenCard';
import Pagination from '../../../../../components/Pagination';

interface WalletTokensListProps extends RouteComponentProps {
  tokens: any;
  accountTokens: any;
  fetchTokensRequest: () => void;
  fetchAccountTokensRequest: () => void;
}

const WalletTokensList: React.FunctionComponent<WalletTokensListProps> = (
  props: WalletTokensListProps
) => {
  const defaultPage = 1;
  const [tableData, settableData] = useState([]);
  const [currentPage, setCurrentPage] = useState<number>(defaultPage);
  const pageSize = TOKEN_LIST_PAGE_SIZE;
  const { fetchAccountTokensRequest, accountTokens } = props;
  const total = accountTokens.length;
  const pagesCount = Math.ceil(total / pageSize);
  const from = (currentPage - 1) * pageSize;
  const to = Math.min(total, currentPage * pageSize);

  useEffect(() => {
    fetchAccountTokensRequest();
  }, []);

  function paginate(pageNumber, tokensList?: any[]) {
    const clone = cloneDeep(tokensList || accountTokens);
    const tableData = clone.slice(
      (pageNumber - 1) * pageSize,
      pageNumber * pageSize
    );
    setCurrentPage(pageNumber);
    settableData(tableData);
  }

  useEffect(() => {
    const tokensList: any[] = filterByValue(accountTokens, '');
    paginate(defaultPage, tokensList);
  }, [accountTokens]);

  const handleCardClick = (symbol, hash, amount) => {
    props.history.push(
      `${WALLET_PAGE_PATH}?symbol=${symbol}&hash=${hash}&amount=${amount}`
    );
  };

  return (
    <div className='main-wrapper'>
      <Helmet>
        <title>
          {I18n.t('containers.wallet.walletTokensPage.walletTokens')}
        </title>
      </Helmet>
      <header className='header-bar'>
        <h1>{I18n.t('containers.wallet.walletTokensPage.tokens')}</h1>
        {/* <ButtonGroup>
          <Button to={WALLET_ADD_TOKEN_PATH} tag={RRNavLink} color='link'>
            <MdAdd />
            <span className='d-lg-inline'>
              {I18n.t('containers.wallet.walletTokensPage.addToken')}
            </span>
          </Button>
        </ButtonGroup> */}
      </header>
      <div className='content'>
        {tableData.map((token, index) => (
          <WalletTokenCard
            handleCardClick={handleCardClick}
            key={index}
            token={token}
          />
        ))}
        <Pagination
          label={I18n.t('containers.tokens.tokensPage.paginationRange', {
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
  const {
    tokens,
    isTokensLoaded,
    isLoadingTokens,
    accountTokens,
    isAccountTokensLoaded,
    isAccountLoadingTokens,
  } = state.wallet;
  return {
    tokens,
    isTokensLoaded,
    isLoadingTokens,
    accountTokens,
    isAccountTokensLoaded,
    isAccountLoadingTokens,
  };
};

const mapDispatchToProps = {
  fetchTokensRequest,
  fetchAccountTokensRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(WalletTokensList);
