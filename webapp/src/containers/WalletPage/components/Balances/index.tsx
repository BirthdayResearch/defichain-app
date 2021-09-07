import { cloneDeep } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import { RootState } from '../../../../app/rootTypes';
import Pagination from '../../../../components/Pagination';
import {
  BTC,
  BTC_SPV_SYMBOL,
  DFI_SYMBOL,
  TOKEN_LIST_PAGE_SIZE,
} from '../../../../constants';
import { IToken } from '../../../../utils/interfaces';
import { filterByValue, getPageTitle } from '../../../../utils/utility';
import Header from '../../../HeaderComponent';
import {
  fetchAccountTokensRequest,
  fetchInstantBalanceRequest,
  fetchTokensRequest,
  getSPVBalance,
} from '../../reducer';
import { getVerifiedTokens, updateWalletToken } from '../../service';
import CreateOrRestoreWalletPage from '../CreateOrRestoreWalletPage';
import BalancesTokenCard from './BalancesTokenCard';
import styles from './Balances.module.scss';
import classnames from 'classnames';
import { MdInfo } from 'react-icons/md';
import dfiBG from '../../../../assets/svg/balance_dfi.svg';
import btcBG from '../../../../assets/svg/balance_btc.svg';
import { openBalanceTooltipModal } from '../../../PopOver/reducer';

export type BalanceToken = Partial<IToken>;

const BalancesPage: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const defaultPage = 1;

  const {
    wallet: {
      isWalletCreatedFlag,
      walletBalance,
      spv,
      accountTokens,
      isLoadingTokens,
      tokens: allAppTokens,
      utxoDfi,
    },
    settings: {
      appConfig: { unit },
    },
  } = useSelector((state: RootState) => state);

  const [dfiToken, setDfiToken] = useState<BalanceToken>({
    symbol: unit,
    symbolKey: unit,
    amount: walletBalance ?? 0,
    hash: DFI_SYMBOL,
    displayName: unit,
    isDAT: true,
  });

  const [btcNative, setBtcNative] = useState<BalanceToken>({
    symbol: BTC,
    symbolKey: BTC,
    amount: spv?.balance ?? 0,
    hash: BTC_SPV_SYMBOL,
    isSPV: true,
    displayName: BTC,
  });

  const [tokens, setTokens] = useState<BalanceToken[]>([]);
  const [walletTableData] = useState<any>([]);
  const [verifiedTokens, setVerifiedTokens] = useState<BalanceToken[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(defaultPage);

  const paginate = (
    pageNumber,
    tokensList?: IToken[],
    appTokens: IToken[] = []
  ) => {
    let clone = cloneDeep(tokensList || totalTokenData);
    const keys = {};
    clone.forEach((t) => {
      keys[t.hash] = t.symbol;
    });
    appTokens = (appTokens || []).filter((t) => !keys[t.hash]);
    clone = [...clone, ...appTokens]
      .sort(
        (a: IToken, b: IToken) =>
          (a.amount ? -1 : 0) - (b.amount ? -1 : 0) ||
          +a.isLPS - +b.isLPS ||
          +a.hash - +b.hash
      )
      .filter((t: IToken) => t.hash != DFI_SYMBOL);

    updateWalletToken(clone);

    const tableData = clone.slice(
      (pageNumber - 1) * pageSize,
      pageNumber * pageSize
    );
    setCurrentPage(pageNumber);
    setTokens(tableData);
  };

  const largeIcon = '32px';
  const pageSize = TOKEN_LIST_PAGE_SIZE;
  const totalTokenData = [
    ...accountTokens,
    ...walletTableData,
    ...verifiedTokens,
  ];
  const total = [...new Set(totalTokenData)].length;
  const pagesCount = Math.ceil(total / pageSize);
  const from = (currentPage - 1) * pageSize;
  const to = Math.min(total, currentPage * pageSize);

  useEffect(() => {
    dispatch(fetchTokensRequest());
    dispatch(fetchInstantBalanceRequest());
    dispatch(fetchAccountTokensRequest());
    dispatch(getSPVBalance());
  }, []);

  useEffect(() => {
    const verifiedTokens = getVerifiedTokens(allAppTokens, accountTokens);
    setVerifiedTokens(verifiedTokens);
    const tokensList: IToken[] = filterByValue(accountTokens, '');
    if (currentPage === defaultPage) {
      paginate(
        defaultPage,
        [...tokensList, ...walletTableData],
        verifiedTokens
      );
    }
  }, [
    accountTokens?.length,
    isLoadingTokens,
    walletBalance,
    tokens?.length,
    walletTableData,
  ]);

  useEffect(() => {
    if (dfiToken) {
      setDfiToken({
        ...dfiToken,
        amount: walletBalance,
      });
    }
    if (btcNative) {
      setBtcNative({
        ...btcNative,
        amount: spv?.balance,
      });
    }
  }, [walletBalance, spv?.balance]);

  const openInfoPopup = () => {
    dispatch(openBalanceTooltipModal(true));
  };

  return (
    <div className='main-wrapper'>
      {!isWalletCreatedFlag ? (
        <CreateOrRestoreWalletPage />
      ) : (
        <>
          <Helmet>
            <title>
              {getPageTitle(I18n.t('containers.wallet.walletPage.balances'))}
            </title>
          </Helmet>
          <Header>
            <h1>{I18n.t('containers.wallet.walletPage.balances')}</h1>
          </Header>
          <div className='content'>
            <div className='dfiCard mb-3'>
              <BalancesTokenCard
                token={dfiToken as IToken}
                size={largeIcon}
                bgImage={dfiBG}
                hideMore={true}
                hideBadge={true}
                utxoDfi={utxoDfi}
              />
            </div>
            <div className='btcCard mb-5'>
              <BalancesTokenCard
                token={btcNative as IToken}
                size={largeIcon}
                bgImage={btcBG}
                hideSwap={true}
                hideMore={true}
                hideBadge={true}
              />
            </div>
            <h2 className='d-flex align-items-center'>
              <span>{I18n.t('containers.wallet.walletPage.tokens')}</span>
              <MdInfo
                className={`ml-1 ${styles.icons} cursorPointer`}
                id='token_item'
                size={23}
                onClick={() => openInfoPopup()}
              />
            </h2>
            <div className={classnames({ cardTable: true })}>
              {tokens.map((token, index) => (
                <BalancesTokenCard
                  key={index}
                  token={token as IToken}
                  hideSwap={token.isLPS}
                />
              ))}
            </div>
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
        </>
      )}
    </div>
  );
};

export default BalancesPage;
