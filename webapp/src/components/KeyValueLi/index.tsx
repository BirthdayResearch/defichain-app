import React, { useState } from 'react';
import EllipsisText from 'react-ellipsis-text';
import CopyToClipboard from '../CopyToClipboard';
import classnames from 'classnames';
import QrCode from '../QrCode';
import { I18n } from 'react-redux-i18n';
import styles from './KeyValueLi.module.scss';

interface KeyValueLiProps {
  copyable?: boolean | string;
  value?: string;
  popsQR?: any;
  uid?: any;
  label?: string;
}

const KeyValueLi: React.FunctionComponent<KeyValueLiProps> = (
  props: KeyValueLiProps
) => {
  const [copied, changeCopied] = useState(false);

  const handleCopy = () => {
    changeCopied(true);
    setTimeout(() => {
      changeCopied(false);
    }, 600);
  };

  return (
    <div className={styles.keyValueLi}>
      <div className={styles.label}>{props.label}</div>
      <div className={styles.value}>
        <div
          className={classnames({ 'd-flex': copied }, styles.copiedIndicator)}
        >
          {I18n.t('components.keyValueLi.copied')}
        </div>
        <EllipsisText text={props.value} length={50} />
        {props.popsQR && (
          <QrCode value={props.value} uid={props.uid} qrClass={styles.qr} />
        )}
        {props.copyable && (
          <CopyToClipboard value={props.value!} handleCopy={handleCopy} />
        )}
      </div>
    </div>
  );
};

export default KeyValueLi;
