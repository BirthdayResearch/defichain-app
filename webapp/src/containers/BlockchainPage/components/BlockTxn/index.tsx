import React, { useState } from 'react';
import { Button, Card } from 'reactstrap';
import { MdInfo, MdArrowForward } from 'react-icons/md';
import styles from './BlockTxn.module.scss';
import CopyToClipboard from '../../../../components/CopyToClipboard';
import classnames from 'classnames';
import { I18n } from 'react-redux-i18n';
import { ITxn } from '../../interfaces';

interface BlockTxnProps {
  txn: ITxn;
  unit: string;
}

interface BlockTxnState {
  copied: boolean;
}

const BlockTxn: React.FunctionComponent<BlockTxnProps> = (
  props: BlockTxnProps
) => {
  const { txn, unit } = props;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 600);
  };
  return (
    <Card className={`${styles.txn} styles.txn`}>
      <div className={styles.header}>
        <span className={styles.hash}>
          <div
            className={classnames(
              { 'd-block': copied },
              styles.copiedIndicator
            )}
          >
            {I18n.t('containers.blockChainPage.blockTxn.copied')}
          </div>
          <span className={styles.hashSpan}>{txn.hash}</span>
          <CopyToClipboard value={txn.hash} handleCopy={handleCopy} />
        </span>
        <span className={styles.time}>
          <span className={styles.timeSpan}>{txn.time}</span>
          <Button color='link' size='sm' className='padless ml-2'>
            <MdInfo />
          </Button>
        </span>
      </div>
      <div className={styles.addresses}>
        <div className={styles.froms}></div>
        <div className={styles.arrow}>
          <MdArrowForward />
        </div>
        <div className={styles.tos}>
          {txn.tos.map((to, index) => (
            <div className={styles.to} key={`${to.address}${index}`}>
              <span className={styles.address}>
                {to.address
                  ? to.address
                  : I18n.t(
                      'containers.blockChainPage.blockTxn.unparsedAddress'
                    )}
              </span>
              <span className={styles.amount}>
                {to.amount}&nbsp;
                <span className={styles.unit}>{unit}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default BlockTxn;
