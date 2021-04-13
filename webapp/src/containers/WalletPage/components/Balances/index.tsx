import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import { RootState } from '../../../../app/rootTypes';
import { DFI_SYMBOL } from '../../../../constants';
import { IToken } from '../../../../utils/interfaces';
import { getPageTitle } from '../../../../utils/utility';
import Header from '../../../HeaderComponent';
import {
  fetchAccountTokensRequest,
  fetchInstantBalanceRequest,
  fetchTokensRequest,
} from '../../reducer';
import CreateOrRestoreWalletPage from '../CreateOrRestoreWalletPage';
import BalancesTokenCard from './BalancesTokenCard';

const BalancesPage: React.FunctionComponent = () => {
  useEffect(() => {
    fetchTokensRequest();
    fetchInstantBalanceRequest();
    fetchAccountTokensRequest();
  }, []);

  const {
    wallet: { isWalletCreatedFlag, walletBalance },
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
              {getPageTitle('containers.wallet.walletPage.walletDeFiApp')}
            </title>
          </Helmet>
          <Header>
            <h1>{I18n.t('containers.wallet.walletPage.balances')}</h1>
          </Header>
          <div className='content'>
            <BalancesTokenCard
              onCardClick={() => {}}
              token={dfiToken as IToken}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default BalancesPage;
