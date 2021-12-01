import React from 'react';
import TokenAvatar from '../TokenAvatar';

import styles from './PairIcon.module.scss';

interface PairIconProps {
  poolpair: any;
}

const PairIcon: React.FunctionComponent<PairIconProps> = (
  props: PairIconProps
) => {
  const { poolpair } = props;

  return (
    <div className={styles.pairIcons}>
      <TokenAvatar symbol={poolpair.tokenB.symbol} size='24px' />
      <TokenAvatar symbol={poolpair.tokenA.symbol} size='24px' />
    </div>
  );
};

export default PairIcon;
