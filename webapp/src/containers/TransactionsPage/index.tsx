import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import TransactionTable from './components/TransactionTable';
import { I18n } from 'react-redux-i18n';
import Header from '../HeaderComponent';
import { MdFileDownload } from 'react-icons/md';
import { ButtonGroup, Button } from 'reactstrap';
import { getPageTitle } from '../../utils/utility';
import { startUpdateApp, openBackupWallet } from '../PopOver/reducer';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { IToken } from 'src/utils/interfaces';

interface TransactionPageProps extends RouteComponentProps {
  unit: string;
  walletBalance: string;
  pendingBalance: string;

  blockChainInfo: any;
  accountTokens: IToken[];
}

const TransactionsPage: React.FunctionComponent<TransactionPageProps> = (
  props: TransactionPageProps
) => {
  const [CsvModalOpen, setCsvModalOpen] = useState(false);
  const [tokenClicked, setTokenClicked] = useState('');
  let isOpen;

  const { accountTokens } = props;

  const handleCsvButtonClick = () => {
    isOpen = !CsvModalOpen;
    setCsvModalOpen(isOpen);
  };

  return (
    <div className='main-wrapper'>
      <Helmet>
        <title>
          {getPageTitle(
            I18n.t('containers.transaction.transactionPage.transactions')
          )}
        </title>
      </Helmet>
      <Header>
        <h1>{I18n.t('containers.transaction.transactionPage.transactions')}</h1>
        <ButtonGroup>
          <Button color='link' size='sm' onClick={handleCsvButtonClick}>
            <MdFileDownload />
            <span className='d-lg-inline'>
              {I18n.t('containers.wallet.walletPage.exportData')}
            </span>
          </Button>
        </ButtonGroup>
      </Header>
      <div className='content'>
        <section className='mb-0'>
          <TransactionTable
            tokenSymbol={tokenClicked}
            CsvModalOpen={CsvModalOpen}
            setCsvModalOpen={setCsvModalOpen}
            isOpen={isOpen}
            handleCsvButtonClick={handleCsvButtonClick}
            tokens={accountTokens}
            tokenClicked={tokenClicked}
            setTokenClicked={setTokenClicked}
          />
        </section>
      </div>
    </div>
  );
};
const mapStateToProps = (state) => {
  const {
    wallet: { walletBalance, pendingBalance, blockChainInfo, accountTokens },
    settings: {
      appConfig: { unit },
    },
  } = state;
  return {
    unit,
    walletBalance,
    pendingBalance,
    blockChainInfo,
    accountTokens,
  };
};

const mapDispatchToProps = {
  startUpdateApp,
  openBackupWallet,
};

export default connect(mapStateToProps, mapDispatchToProps)(TransactionsPage);
