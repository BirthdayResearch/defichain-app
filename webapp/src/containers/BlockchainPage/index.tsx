import React from 'react';
import { Helmet } from 'react-helmet';
import BlockchainTable from './components/BlockchainTable';
import { I18n } from 'react-redux-i18n';

const BlockchainPage = () => {
  return (
    <div className='main-wrapper'>
      <Helmet>
        <title>
          {I18n.t('containers.blockChainPage.blockChainPage.title')}
        </title>
      </Helmet>
      <header className='header-bar'>
        <h1>{I18n.t('containers.blockChainPage.blockChainPage.blockchain')}</h1>
      </header>
      <div className='content'>
        <section className='mb-0'>
          <BlockchainTable />
        </section>
      </div>
    </div>
  );
};

export default BlockchainPage;
