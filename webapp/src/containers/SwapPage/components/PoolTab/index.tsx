import React from 'react';
import { I18n } from 'react-redux-i18n';
import { MdCompareArrows } from 'react-icons/md';

import styles from './poolTab.module.scss';

interface PoolTabProps {}

const PoolTab: React.FunctionComponent<PoolTabProps> = (
  props: PoolTabProps
) => {
  return (
    <>
      <section className={styles.sectionYourLliquidity}>{I18n.t('containers.swap.poolTab.yourLiquidity')}</section>
      {true ? (
        <div className='text-center'>
          <MdCompareArrows size={50} className={styles.svg} />
          <div>{I18n.t('containers.swap.poolTab.noLiquidity')}</div>
          <div className={styles.labelAddLiquidity}>{I18n.t('containers.swap.poolTab.addLiquidity')}</div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default PoolTab;
