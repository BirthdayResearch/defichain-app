import React from 'react';
import { I18n } from 'react-redux-i18n';
import { MdCompareArrows } from 'react-icons/md';
import { Button } from 'reactstrap';
import { NavLink as RRNavLink } from 'react-router-dom';

import {
  CREATE_POOL_PAIR_PATH
} from '../../../../constants';
import styles from './poolTab.module.scss';

interface PoolTabProps {}

const PoolTab: React.FunctionComponent<PoolTabProps> = (
  props: PoolTabProps
) => {
  return (
    <>
      <section className={styles.sectionYourLliquidity}>
        {I18n.t('containers.swap.poolTab.yourLiquidity')}
      </section>
      {true ? (
        <div className='text-center'>
          <MdCompareArrows size={50} className={styles.svg} />
          <div>{I18n.t('containers.swap.poolTab.noLiquidity')}</div>
          <Button to={CREATE_POOL_PAIR_PATH} tag={RRNavLink} color='link'>
            <div className={styles.labelAddLiquidity}>
              {I18n.t('containers.swap.poolTab.addLiquidity')}
            </div>
          </Button>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default PoolTab;
