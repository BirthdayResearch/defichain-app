import React from 'react';
import Loader from '../Loader';
import styles from './WalletLoadingFooter.module.scss';

interface WalletLoadingFooterProps {
  message: string;
}

const WalletLoadingFooter: React.FunctionComponent<WalletLoadingFooterProps> = (
  props: WalletLoadingFooterProps
) => {
  const { message } = props;

  return (
    <div className='footer-sheet'>
      <dl className='row'>
        <dd className='col-12'>
          <div className={styles.createWalletLabel}>
            <Loader className='mb-5' size={28} />
            <p>{message}</p>
          </div>
        </dd>
      </dl>
    </div>
  );
};

export default WalletLoadingFooter;
