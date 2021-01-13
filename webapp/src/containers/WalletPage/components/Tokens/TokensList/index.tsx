import React, { useState, useEffect } from 'react';
import { NavLink as RRNavLink, RouteComponentProps } from 'react-router-dom';
import { I18n } from 'react-redux-i18n';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import cloneDeep from 'lodash/cloneDeep';
import {
  fetchTokensRequest,
  fetchAccountTokensRequest,
  fetchInstantBalanceRequest,
} from '../../../reducer';
import { filterByValue, getPageTitle } from '../../../../../utils/utility';
import {
  WALLET_PAGE_PATH,
  TOKEN_LIST_PAGE_SIZE,
} from '../../../../../constants';
import WalletTokenCard from '../../../../../components/TokenCard/WalletTokenCard';
import Pagination from '../../../../../components/Pagination';
import CreateOrRestoreWalletPage from '../../CreateOrRestoreWalletPage';
import Header from '../../../../HeaderComponent';
import { IToken } from 'src/utils/interfaces';
import { getWalletPathAddress } from '../../SendPage';
interface WalletTokensListProps extends RouteComponentProps {
  tokens: IToken[];
  unit: string;
  accountTokens: IToken[];
  walletBalance: any;
  fetchTokensRequest: () => void;
  fetchAccountTokensRequest: () => void;
  isWalletCreatedFlag: boolean;
  openResetWalletDatModal: boolean;
  isLoadingTokens: boolean;
}

const WalletTokensList: React.FunctionComponent<WalletTokensListProps> = (
  props: WalletTokensListProps
) => {
  const {
    unit,
    history,
    isWalletCreatedFlag,
    tokens,
    isLoadingTokens,
    fetchTokensRequest,
  } = props;
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
    fetchTokensRequest();
    fetchInstantBalanceRequest();
    fetchAccountTokensRequest();
  }, []);

  function paginate(
    pageNumber,
    tokensList?: IToken[],
    appTokens: IToken[] = []
  ) {
    let clone = cloneDeep(tokensList || accountTokens);
    const keys = {};
    clone.forEach((t) => {
      clearDFITokenName(t);
      keys[t.hash] = t.symbol;
    });
    appTokens = (appTokens || []).filter((t) => !keys[t.hash]);
    clone = [...clone, ...appTokens].sort(
      (a: IToken, b: IToken) => +a.hash - +b.hash
    );
    const tableData = clone.slice(
      (pageNumber - 1) * pageSize,
      pageNumber * pageSize
    );
    setCurrentPage(pageNumber);
    settableData(tableData);
  }

  const clearDFITokenName = (token: IToken) => {
    //* Remove default text for DFI
    if (token.hash == '0') {
      token.name = '';
    }
  };

  useEffect(() => {
    const verifiedTokens = cloneDeep<IToken[]>(tokens || []).filter((t) => {
      clearDFITokenName(t);
      t.amount = 0;
      return t.isDAT && !t.isLPS;
    });
    const tokensList: IToken[] = filterByValue(accountTokens, '');
    paginate(defaultPage, tokensList, verifiedTokens);
  }, [accountTokens, isLoadingTokens]);

  const handleCardClick = (symbol, hash, amount, address, isLPS) => {
    props.history.push(
      getWalletPathAddress(
        WALLET_PAGE_PATH,
        symbol,
        hash,
        amount,
        address,
        isLPS
      )
    );
  };
  return isLoadingTokens ? (
    <div>{I18n.t('containers.tokens.tokensPage.loading')}</div>
  ) : (
    <>
      {!isWalletCreatedFlag ? (
        <div className='main-wrapper'>
          <CreateOrRestoreWalletPage history={history} />
        </div>
      ) : (
        <div className='main-wrapper'>
          <Helmet>
            <title>
              {getPageTitle(
                I18n.t('containers.wallet.walletPage.walletDeFiApp')
              )}
            </title>
          </Helmet>
          <Header>
            <h1>{I18n.t('containers.wallet.walletPage.wallets')}</h1>
            {/* <ButtonGroup>
            <Button to={WALLET_ADD_TOKEN_PATH} tag={RRNavLink} color='link'>
              <MdAdd />
              <span className='d-lg-inline'>
                {I18n.t('containers.wallet.walletWalletsPage.addWallet')}
              </span>
            </Button>
          </ButtonGroup> */}
          </Header>
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
      isWalletCreatedFlag,
    },
    settings: {
      appConfig: { unit },
    },
    popover: { openResetWalletDatModal },
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
    isWalletCreatedFlag,
    openResetWalletDatModal,
  };
};

const mapDispatchToProps = {
  fetchTokensRequest,
  fetchAccountTokensRequest,
  fetchInstantBalanceRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(WalletTokensList);
