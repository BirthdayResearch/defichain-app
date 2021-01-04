import React from 'react';
import Helmet from 'react-helmet';
import { I18n } from 'react-redux-i18n';
import { MdSync } from 'react-icons/md';
import Header from '../../../../HeaderComponent';
import styles from './walletSyncPage.module.scss';
import { getPageTitle } from '../../../../../utils/utility';

const WalletSyncPage: React.FunctionComponent = () => {
  return (
    <div>
      <Helmet>
        <title>
          {getPageTitle(
            I18n.t('containers.wallet.createOrRestoreWalletPage.title')
          )}
        </title>
      </Helmet>
      <Header>
        <h1>
          {I18n.t(
            'containers.wallet.createOrRestoreWalletPage.createOrRestoreWallet'
          )}
        </h1>
      </Header>
      <div className='content'>
        <section className={styles.syncSection}>
          <MdSync size={20} className={styles.syncIcon} />
          <span className={styles.syncContent}>
            {I18n.t(
              'containers.wallet.createOrRestoreWalletPage.walletSyncNotice'
            )}
          </span>
        </section>
      </div>
    </div>
  );
};

export default WalletSyncPage;
