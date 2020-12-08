import React, { useState } from 'react';
import EllipsisText from 'react-ellipsis-text';
import CopyToClipboard from '../../CopyToClipboard';
import classnames from 'classnames';
import { I18n } from 'react-redux-i18n';
import styles from './ValueLi.module.scss';
import { Col, Row } from 'reactstrap';

interface KeyValueLiProps {
  copyable?: boolean | string;
  value?: string;
  popsQR?: any;
  uid?: any;
  label?: string;
  textLimit?: number | string;
}

const ValueLi: React.FunctionComponent<KeyValueLiProps> = (
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
      <div className={styles.value}>
        <div>
          <div
            className={classnames({ 'd-flex': copied }, styles.copiedIndicator)}
          >
            {I18n.t('components.keyValueLi.copied')}
          </div>
          {props.value ? (
            <EllipsisText text={props.value} length={props.textLimit ?? `50`} />
          ) : (
            '-'
          )}
        </div>
        <div>
          {props.value && props.copyable && (
            <CopyToClipboard value={props.value!} handleCopy={handleCopy} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ValueLi;
