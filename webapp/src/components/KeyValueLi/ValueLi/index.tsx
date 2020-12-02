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
      <div className={styles.label}>{props.label}</div>
      <div className={styles.value}>
        <Row>
          <Col md='10'>
            <div
              className={classnames(
                { 'd-flex': copied },
                styles.copiedIndicator
              )}
            >
              {I18n.t('components.keyValueLi.copied')}
            </div>
            <EllipsisText text={props.value} length={'50'} />
          </Col>
          <Col md='2'>
            {props.copyable && (
              <CopyToClipboard value={props.value!} handleCopy={handleCopy} />
            )}
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ValueLi;
