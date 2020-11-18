import React from 'react';
import Helmet from 'react-helmet';
import { I18n } from 'react-redux-i18n';
import { MdSync } from 'react-icons/md';

import styles from './walletSyncPage.module.scss';

interface WalletSyncPageProps {}

const WalletSyncPage: React.FunctionComponent<WalletSyncPageProps> = () => {
  return (
    <div>
      <Helmet>
        <title>
          {I18n.t('containers.wallet.createOrRestoreWalletPage.title')}
        </title>
      </Helmet>
      <header className='header-bar'>
        <h1>
          {I18n.t(
            'containers.wallet.createOrRestoreWalletPage.createOrRestoreWallet'
          )}
        </h1>
      </header>
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
