import React, { useState, useEffect } from 'react';
import { History } from 'history';
import { I18n } from 'react-redux-i18n';
import { Helmet } from 'react-helmet';
import cloneDeep from 'lodash/cloneDeep';
import { filterByValue, getPageTitle } from '@/utils/utility';
import { TOKEN_LIST_PAGE_SIZE, DFI_SYMBOL } from '@/constants';
import WalletTokenCard from '@/components/TokenCard/WalletTokenCard';
import Pagination from '@/components/Pagination';
import Header from '@/containers/HeaderComponent';
import { IToken } from '@/utils/interfaces';

interface TokensListProps {
  tokens: IToken[];
  unit: string;
  accountTokens: IToken[];
  walletBalance: any;
  getPathAddress: (
    pagePath: string,
    symbol: string,
    hash: string,
    amount: string,
    address: string,
    isLPS: boolean
  ) => string;
  history: History;
  isLoadingTokens: boolean;
  pagePath: string;
}

const TokensList: React.FunctionComponent<TokensListProps> = (
  props: TokensListProps
) => {
  const {
    unit,
    history,
    tokens,
    walletBalance,
    accountTokens,
    getPathAddress,
    pagePath,
    isLoadingTokens,
  } = props;
  const defaultPage = 1;
  const [tableData, settableData] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState<number>(defaultPage);
  const pageSize = TOKEN_LIST_PAGE_SIZE;
  const total = accountTokens.length;
  const pagesCount = Math.ceil(total / pageSize);
  const from = (currentPage - 1) * pageSize;
  const to = Math.min(total, currentPage * pageSize);

  function paginate(
    pageNumber,
    tokensList?: IToken[],
    appTokens: IToken[] = []
  ) {
    let clone = cloneDeep(tokensList || accountTokens);
    const keys = {};
    clone.forEach((t) => {
      keys[t.hash] = t.symbol;
    });
    appTokens = (appTokens || []).filter((t) => !keys[t.hash]);
    clone = [...clone, ...appTokens]
      .sort((a: IToken, b: IToken) => +a.hash - +b.hash)
      .filter((t: IToken) => t.hash !== DFI_SYMBOL);
    const tableData = clone.slice(
      (pageNumber - 1) * pageSize,
      pageNumber * pageSize
    );
    setCurrentPage(pageNumber);
    settableData(tableData);
  }

  useEffect(() => {
    const verifiedTokens = cloneDeep<IToken[]>(tokens || []).filter((t) => {
      t.amount = 0;
      return t.isDAT && !t.isLPS;
    });
    const tokensList: IToken[] = filterByValue(accountTokens, '');
    paginate(defaultPage, tokensList, verifiedTokens);
  }, [accountTokens?.length, isLoadingTokens, walletBalance, tokens?.length]);

  const handleCardClick = (symbol, hash, amount, address, isLPS) => {
    history.push(
      getPathAddress(pagePath, symbol, hash, amount, address, isLPS)
    );
  };
  return (
    <div className='content'>
      <WalletTokenCard
        handleCardClick={handleCardClick}
        token={{
          symbol: unit,
          symbolKey: unit,
          amount: walletBalance,
          hash: DFI_SYMBOL,
          address: '',
        }}
      />
      {tableData.map((token, index) => (
        <WalletTokenCard
          handleCardClick={handleCardClick}
          key={index}
          token={token}
        />
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
  );
};

export default TokensList;
