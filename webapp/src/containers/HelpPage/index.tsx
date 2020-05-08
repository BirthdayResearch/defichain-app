import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { I18n } from 'react-redux-i18n';

const HelpPage = () => {
  return (
    <div className='main-wrapper'>
      <Helmet>
        <title>{I18n.t('containers.helpPage.title')}</title>
      </Helmet>
      <header className='header-bar'>
        <h1>{I18n.t('containers.helpPage.help')}</h1>
      </header>
      <div className='content'>
        <section>{I18n.t('containers.helpPage.section')}</section>
      </div>
    </div>
  );
};

export default HelpPage;
