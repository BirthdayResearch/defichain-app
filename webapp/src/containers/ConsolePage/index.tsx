import React from 'react';
import { I18n } from 'react-redux-i18n';
import { Helmet } from 'react-helmet';
import Console from './ConsoleComponent';
import Header from '../HeaderComponent';
import styles from './Console.module.scss';
import { getPageTitle } from '../../utils/utility';

const ConsolePage: React.FunctionComponent = () => {
  return (
    <div className='main-wrapper'>
      <Helmet>
        <title>
          {getPageTitle(
            I18n.t('containers.console.consolePage.consoleDeFiApp')
          )}
        </title>
      </Helmet>
      <Header>
        <h1>{I18n.t('containers.console.consolePage.console')}</h1>
      </Header>
      <div className={`content ${styles.consoleContent}`}>
        <section>
          <Console />
        </section>
      </div>
    </div>
  );
};

export default ConsolePage;
