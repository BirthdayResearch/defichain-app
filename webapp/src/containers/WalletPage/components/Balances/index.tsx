import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import { RootState } from '../../../../app/rootTypes';
import { BTC, BTC_SYMBOL, DFI_SYMBOL } from '../../../../constants';
import { IToken } from '../../../../utils/interfaces';
import { getPageTitle } from '../../../../utils/utility';
import Header from '../../../HeaderComponent';
import {
  fetchAccountTokensRequest,
  fetchInstantBalanceRequest,
  fetchTokensRequest,
  getSPVBalance,
} from '../../reducer';
import CreateOrRestoreWalletPage from '../CreateOrRestoreWalletPage';
import BalancesTokenCard from './BalancesTokenCard';

const BalancesPage: React.FunctionComponent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTokensRequest());
    dispatch(fetchInstantBalanceRequest());
    dispatch(fetchAccountTokensRequest());
    dispatch(getSPVBalance());
  }, []);

  const {
    wallet: { isWalletCreatedFlag, walletBalance, spv },
    settings: {
      appConfig: { unit },
    },
  } = useSelector((state: RootState) => state);

  const [dfiToken, setDFIToken] = useState<Partial<IToken>>({
    symbol: unit,
    symbolKey: unit,
    amount: walletBalance ?? 0,
    hash: DFI_SYMBOL,
  });

  const [btcNative, setbtcNative] = useState<Partial<IToken>>({
    symbol: BTC,
    symbolKey: BTC,
    amount: spv?.balance ?? 0,
    hash: BTC_SYMBOL,
  });

  const largeIcon = '32px';

  return (
    <div className='main-wrapper'>
      {!isWalletCreatedFlag ? (
        <div className='main-wrapper'>
          <CreateOrRestoreWalletPage history={history} />
        </div>
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
              <BalancesTokenCard token={dfiToken as IToken} size={largeIcon} />
            </div>
            <div className='btcCard mb-3'>
              <BalancesTokenCard token={btcNative as IToken} size={largeIcon} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BalancesPage;
