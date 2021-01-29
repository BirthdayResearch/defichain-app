import React, { useState, useEffect } from 'react';
import { NavLink as RRNavLink, RouteComponentProps } from 'react-router-dom';
import { I18n } from 'react-redux-i18n';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import cloneDeep from 'lodash/cloneDeep';
import { Button, ButtonGroup, Row, Col } from 'reactstrap';
import { MdAdd } from 'react-icons/md';
import {
  fetchTokensRequest,
  fetchAccountTokensRequest,
  fetchInstantBalanceRequest,
} from '../../../reducer';
import {
  filterByValue,
  getPageTitle,
  getToken,
} from '../../../../../utils/utility';
import {
  handleAddToken,
  getWalletToken,
  getVerifiedTokens,
  updateWalletToken,
} from '../../../service';
import {
  WALLET_PAGE_PATH,
  TOKEN_LIST_PAGE_SIZE,
  DFI_SYMBOL,
} from '../../../../../constants';
import WalletTokenCard from '../../../../../components/TokenCard/WalletTokenCard';
import Pagination from '../../../../../components/Pagination';
import CreateOrRestoreWalletPage from '../../CreateOrRestoreWalletPage';
import Header from '../../../../HeaderComponent';
import { IToken } from 'src/utils/interfaces';
import { getWalletPathAddress } from '../../SendPage';
import WalletDropdown from '../../../../../components/walletDropdown';
import { difference } from 'lodash';
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
  const { unit, history, isWalletCreatedFlag, tokens, isLoadingTokens } = props;
  const defaultPage = 1;
  const [tableData, settableData] = useState<any>([]);
  const [walletTableData, setwalletTableData] = useState<any>([]);
  const [tokenData, setTokenData] = useState<any>([]);
  const [verifiedTokens, setVerifiedTokens] = useState<any>([]);
  const [formState, setFormState] = useState<any>({
    amount1: '',
    hash1: '',
    symbol1: '',
  });
  const [currentPage, setCurrentPage] = useState<number>(defaultPage);
  const pageSize = TOKEN_LIST_PAGE_SIZE;
  const {
    fetchAccountTokensRequest,
    fetchTokensRequest,
    accountTokens,
  } = props;
  const total = [
    ...new Set([...accountTokens, ...verifiedTokens, ...walletTableData]),
  ].length;
  const pagesCount = Math.ceil(total / pageSize);
  const from = (currentPage - 1) * pageSize;
  const to = Math.min(total, currentPage * pageSize);

  useEffect(() => {
    fetchTokensRequest();
    fetchInstantBalanceRequest();
    fetchAccountTokensRequest();
    const tokenMap = getToken(props.tokens);
    setTokenData(tokenMap);
    const walletToken = getWalletToken();
    setwalletTableData(walletToken);
  }, []);

  useEffect(() => {
    const verifiedTokens = getVerifiedTokens(tokens);
    setVerifiedTokens(verifiedTokens);
    const tokensList: IToken[] = filterByValue(accountTokens, '');
    if (currentPage === defaultPage) {
      paginate(
        defaultPage,
        [...tokensList, ...walletTableData],
        verifiedTokens
      );
    }
  }, [accountTokens, isLoadingTokens, props.walletBalance, walletTableData]);

  function paginate(
    pageNumber,
    tokensList?: IToken[],
    appTokens: IToken[] = []
  ) {
    let clone = cloneDeep(
      tokensList || [...accountTokens, ...walletTableData, ...verifiedTokens]
    );
    const keys = {};
    clone.forEach((t) => {
      keys[t.hash] = t.symbol;
    });
    appTokens = (appTokens || []).filter((t) => !keys[t.hash]);
    clone = [...clone, ...appTokens]
      .sort((a: IToken, b: IToken) => +a.hash - +b.hash)
      .filter((t: IToken) => t.hash != '0');
    const allTokenArray = clone.map((token) => token.symbolKey);
    if (allTokenArray.length !== [...new Set(allTokenArray)].length) {
      const duplicateArray = allTokenArray.filter(
        (value, index) => allTokenArray.indexOf(value) === index
      );
      updateWalletToken(duplicateArray);
    }
    const tableData = [...new Set(clone)].slice(
      (pageNumber - 1) * pageSize,
      pageNumber * pageSize
    );
    setCurrentPage(pageNumber);
    settableData(tableData);
  }

  const handleDropDown = (
    hash: string,
    field1: string,
    symbol: string,
    field2: string,
    name: string
  ) => {
    const tokenInfo = {
      symbol: symbol,
      symbolKey: symbol,
      amount: '0.00000000',
      hash: hash,
      address: '',
      name: name,
    };
    const walletTokensList = handleAddToken(tokenInfo);
    setwalletTableData(walletTokensList);
    setFormState({
      ...formState,
      [field1]: hash,
      [field2]: symbol,
    });
  };

  const getTokenForWalletDropDown = () => {
    const existingTokenArray = [
      ...accountTokens,
      ...walletTableData,
      ...verifiedTokens,
    ].map((value) => value.symbolKey);
    const filteredTokenMap = new Map<string, any>();
    tokenData.forEach((value, key) => {
      if (!existingTokenArray.includes(key)) {
        filteredTokenMap.set(key, value);
      }
    });
    return filteredTokenMap;
  };

  const isWalletDropdown = () => {
    const existingTokenArray = [
      ...accountTokens,
      ...walletTableData,
      ...verifiedTokens,
    ].map((value) => value.symbolKey);
    let tokenDataArray: any[] = [];
    tokenData.forEach((value, key) => {
      tokenDataArray = [...tokenDataArray, value.symbolKey];
    });
    const diffreneceArray = difference(existingTokenArray, tokenData);
    return diffreneceArray.length > 1 ? true : false;
  };

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
            <h1>{I18n.t('containers.wallet.walletPage.balances')}</h1>
            <ButtonGroup disabled={!isWalletDropdown()}>
              <WalletDropdown
                tokenMap={getTokenForWalletDropDown()}
                name={1}
                formState={formState}
                handleDropdown={handleDropDown}
                dropdownLabel={'dropdownLabel'}
              >
                <Button color='link' disabled={!isWalletDropdown()}>
                  <MdAdd />
                  <span className='d-lg-inline'>
                    {I18n.t('containers.wallet.walletWalletsPage.addBalance')}
                  </span>
                </Button>
              </WalletDropdown>
            </ButtonGroup>
          </Header>
          <div className='content'>
            <WalletTokenCard
              handleCardClick={handleCardClick}
              token={{
                symbol: unit,
                symbolKey: unit,
                amount: props.walletBalance,
                hash: DFI_SYMBOL,
                address: '',
              }}
            />
            {tableData.map((token, index) => (
              <WalletTokenCard
                setwalletTableData={setwalletTableData}
                handleCardClick={handleCardClick}
                key={index}
                token={token}
              />
            ))}
            <Pagination
              label={I18n.t(
                'containers.wallet.walletPage.walletPaginationRange',
                {
                  to,
                  total,
                  from: from + 1,
                }
              )}
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
