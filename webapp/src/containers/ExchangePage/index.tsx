import React from 'react';
import { Helmet } from 'react-helmet';
import { I18n } from 'react-redux-i18n';
import Header from '../HeaderComponent';

const ExchangePage = () => {
  return (
    <div className='main-wrapper'>
      <Helmet>
        <title>{I18n.t('containers.exchangePage.title')}</title>
      </Helmet>
      <Header>
        <h1>{I18n.t('containers.exchangePage.exchange')}</h1>
      </Header>
      <div className='content'>
        <section>{I18n.t('containers.exchangePage.section')}</section>
      </div>
      <footer className='footer-bar'>
        {I18n.t('containers.exchangePage.footerBar')}
      </footer>
    </div>
  );
};

export default ExchangePage;
