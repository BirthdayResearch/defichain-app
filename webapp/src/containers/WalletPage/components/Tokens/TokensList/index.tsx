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
  fetchInstantBalanceRequest,
} from '../../../reducer';
import { filterByValue, isWalletCreated } from '../../../../../utils/utility';
import {
  WALLET_ADD_TOKEN_PATH,
  WALLET_PAGE_PATH,
  TOKEN_LIST_PAGE_SIZE,
  DESTRUCTION_TX,
} from '../../../../../constants';
import WalletTokenCard from '../../../../../components/TokenCard/WalletTokenCard';
import Pagination from '../../../../../components/Pagination';
import CreateOrRestoreWalletPage from '../../CreateOrRestoreWalletPage';
import Header from '../../../../HeaderComponent';
interface WalletTokensListProps extends RouteComponentProps {
  tokens: any;
  unit: string;
  accountTokens: any;
  walletBalance: any;
  fetchTokensRequest: () => void;
  fetchAccountTokensRequest: () => void;
}

const WalletTokensList: React.FunctionComponent<WalletTokensListProps> = (
  props: WalletTokensListProps
) => {
  const { unit, history } = props;
  const defaultPage = 1;
  const [tableData, settableData] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState<number>(defaultPage);
  const pageSize = TOKEN_LIST_PAGE_SIZE;
  const { fetchAccountTokensRequest, accountTokens } = props;
  const total = accountTokens.length;
  const pagesCount = Math.ceil(total / pageSize);
  const from = (currentPage - 1) * pageSize;
  const to = Math.min(total, currentPage * pageSize);

  useEffect(() => {
    fetchInstantBalanceRequest();
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

  const handleCardClick = (symbol, hash, amount, address) => {
    props.history.push(
      `${WALLET_PAGE_PATH}?symbol=${symbol}&hash=${hash}&amount=${amount}&address=${address}`
    );
  };

  const handleCardClickDefault = () => {
    props.history.push(WALLET_PAGE_PATH);
  };

  return (
    <>
      {!isWalletCreated() ? (
        <div className='main-wrapper'>
          <CreateOrRestoreWalletPage history={history} />
        </div>
      ) : (
        <div className='main-wrapper'>
          <Helmet>
            <title>
              {I18n.t('containers.wallet.walletTokensPage.walletTokens')}
            </title>
          </Helmet>
          <Header>
            <h1>{I18n.t('containers.wallet.walletTokensPage.tokens')}</h1>
            {/* <ButtonGroup>
          <Button to={WALLET_ADD_TOKEN_PATH} tag={RRNavLink} color='link'>
            <MdAdd />
            <span className='d-lg-inline'>
              {I18n.t('containers.wallet.walletTokensPage.addToken')}
            </span>
          </Button>
        </ButtonGroup> */}
          </Header>
          <div className='content'>
            <WalletTokenCard
              handleCardClick={handleCardClickDefault}
              token={{
                symbol: unit,
                symbolKey: unit,
                amount: props.walletBalance,
                hash: '0',
                address: '',
              }}
            />
            {tableData
              .filter((data) => data.hash !== '0')
              .map((token, index) => (
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
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  const {
    wallet: {
      tokens,
      isTokensLoaded,
      isLoadingTokens,
      accountTokens,
      isAccountTokensLoaded,
      isAccountLoadingTokens,
      walletBalance,
    },
    settings: {
      appConfig: { unit },
    },
  } = state;
  return {
    unit,
    tokens,
    isTokensLoaded,
    isLoadingTokens,
    accountTokens,
    isAccountTokensLoaded,
    isAccountLoadingTokens,
    walletBalance,
  };
};

const mapDispatchToProps = {
  fetchTokensRequest,
  fetchAccountTokensRequest,
  fetchInstantBalanceRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(WalletTokensList);
