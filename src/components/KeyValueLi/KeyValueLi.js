import React from 'react'
import styles from './KeyValueLi.module.scss';

const keyValueLi = (props) => {
  return (
    <div className={styles.keyValueLi}>
      <span className={styles.label}>
        {props.label}
      </span>
      <span className={styles.val}>
        {props.value}
      </span>
    </div>
  );
}

export default keyValueLi;