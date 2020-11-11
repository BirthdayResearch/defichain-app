import React from 'react';
import { getIcon } from '../../utils/utility';

import styles from './PairIcon.module.scss';

interface PairIconProps {
  poolpair: any;
}

const PairIcon: React.FunctionComponent<PairIconProps> = (
  props: PairIconProps
) => {
  const { poolpair } = props;

  return (
    <div className={styles.imgDesign}>
      <img src={getIcon(poolpair.tokenA)} height={'24px'} width={'24px'} />
      <img src={getIcon(poolpair.tokenB)} height={'24px'} width={'24px'} />
    </div>
  );
};

export default PairIcon;
