import React, { useState, useEffect } from 'react';
import { NavLink as RRNavLink } from 'react-router-dom';
import { I18n } from 'react-redux-i18n';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { MdSearch, MdAdd } from 'react-icons/md';
import { Button, ButtonGroup, Col, Row } from 'reactstrap';
import classnames from 'classnames';
import SearchBar from '../../components/SearchBar';
import DCTTokenCard from '../../components/TokenCard/DCT';
import { fetchTokensRequest } from './reducer';
import {
  CREATE_TOKENS_PATH,
  TOKENS_PATH,
  TOKEN_LIST_PAGE_SIZE,
} from '../../constants';
import Header from '../HeaderComponent';
import { filterByValue, getPageTitle } from '../../utils/utility';
import cloneDeep from 'lodash/cloneDeep';
import Pagination from 'src/components/Pagination';
import { history } from '../../utils/history';

interface TokensProps {
  tokens: any;
  searchQuery: string;
  fetchTokensRequest: () => void;
  isLoadingTokens: boolean;
}

const TokensPage: React.FunctionComponent<TokensProps> = (
  props: TokensProps
) => {
  const defaultPage = 1;
  const [searching, setSearching] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { tokens, fetchTokensRequest, isLoadingTokens } = props;
  const [tableData, settableData] = useState<any[]>([]);
  const [alldata, setAlldata] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(defaultPage);
  const [total, setTotal] = useState<number>(0);
  const [pagesCount, setPagesCount] = useState<number>(0);
  const pageSize = TOKEN_LIST_PAGE_SIZE;
  const from = (currentPage - 1) * pageSize;
  const to = Math.min(total, currentPage * pageSize);

  function paginate(pageNumber) {
    const dataVal = cloneDeep(alldata);
    const tableData = dataVal.slice(
      (pageNumber - 1) * pageSize,
      pageNumber * pageSize
    );
    setCurrentPage(pageNumber);
    settableData(tableData);
  }

  useEffect(() => {
    fetchTokensRequest();
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setAlldata(tokens);
    } else {
      const tokensList: any[] = filterByValue(tokens, searchQuery, [
        'symbol',
        'hash',
        'name',
        'symbolKey',
      ]);
      setAlldata(tokensList);
      setCurrentPage(defaultPage);
    }
  }, [tokens, searchQuery]);

  useEffect(() => {
    setTotal(alldata.length);
    setPagesCount(Math.ceil(alldata.length / pageSize));
    paginate(currentPage);
  }, [alldata]);

  const toggleSearch = () => {
    if (searching) {
      setSearchQuery('');
    }
    setSearching(!searching);
  };

  const handleCardClick = (symbol: string, hash: string) => {
    return history.push(`${TOKENS_PATH}/${symbol}/${hash}`);
  };

  return (
    <div className='main-wrapper'>
      <Helmet>
        <title>
          {getPageTitle(I18n.t('containers.tokens.tokensPage.title'))}
        </title>
      </Helmet>
      <Header>
        <h1 className={classnames({ 'd-none': searching })}>
          {I18n.t('containers.tokens.tokensPage.tokens')}
        </h1>
        <ButtonGroup className={classnames({ 'd-none': searching })}>
          <Button color='link' size='sm' onClick={toggleSearch}>
            <MdSearch />
          </Button>
          <Button to={CREATE_TOKENS_PATH} tag={RRNavLink} color='link'>
            <MdAdd />
            <span className='d-lg-inline'>
              {I18n.t('containers.tokens.tokensPage.createToken')}
            </span>
          </Button>
        </ButtonGroup>
        <SearchBar
          onChange={(e) => setSearchQuery(e.target.value)}
          searching={searching}
          toggleSearch={toggleSearch}
          placeholder={I18n.t('containers.tokens.tokensPage.searchTokens')}
        />
      </Header>
      <div className='content'>
        {isLoadingTokens ? (
          <div>{I18n.t('containers.tokens.tokensPage.loading')}</div>
        ) : (
          <div>
            <section>
              <Row>
                {tableData.map((tokenData, i) => (
                  <Col md='6' key={i}>
                    <DCTTokenCard
                      handleCardClick={handleCardClick}
                      data={tokenData}
                    />
                  </Col>
                ))}
              </Row>
            </section>
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
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  const { tokens, isTokensLoaded, isLoadingTokens } = state.tokens;
  return {
    tokens,
    isTokensLoaded,
    isLoadingTokens,
  };
};

const mapDispatchToProps = {
  fetchTokensRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(TokensPage);
