import React from 'react';
import { Helmet } from 'react-helmet';
import BlockchainTable from './components/BlockchainTable';
import { I18n } from 'react-redux-i18n';
import Header from '../HeaderComponent';
import { MdLaunch } from 'react-icons/md';
import { ButtonGroup, Button } from 'reactstrap';
import openNewTab from '../../utils/openNewTab';
import {
  DEFICHAIN_BLOCKS,
  MAIN,
} from '../../constants';
import { getNetworkType, getPageTitle } from '../../utils/utility';

const BlockchainPage = () => {
  const explorerLink =
    getNetworkType() === MAIN ? `${DEFICHAIN_BLOCKS}` : `${DEFICHAIN_BLOCKS}?network=TestNet`;
  return (
    <div className='main-wrapper'>
      <Helmet>
        <title>
          {getPageTitle(
            I18n.t('containers.blockChainPage.blockChainPage.title')
          )}
        </title>
      </Helmet>
      <Header>
        <h1>{I18n.t('containers.blockChainPage.blockChainPage.blockchain')}</h1>
        <ButtonGroup>
          <Button color='link' onClick={() => openNewTab(explorerLink)}>
            <MdLaunch />
            <span className='d-lg-inline'>
              {I18n.t('containers.blockChainPage.blockChainPage.explorer')}
            </span>
          </Button>
        </ButtonGroup>
      </Header>
      <div className='content'>
        <section className='mb-0'>
          <BlockchainTable />
        </section>
      </div>
    </div>
  );
};

export default BlockchainPage;
