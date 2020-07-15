import React from 'react';
import styles from './Spinner.module.scss';

const Spinner = () => {
  return (
    <svg className={styles.spinner} viewBox='0 0 48 48'>
      <circle
        className={styles.path}
        cx='24'
        cy='24'
        r='16'
        fill='none'
        strokeWidth='6'
      ></circle>
    </svg>
  );
};

export default Spinner;
