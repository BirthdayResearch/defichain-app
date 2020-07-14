import React from 'react';
import { RiErrorWarningLine } from 'react-icons/ri';
import styles from './errorModal.module.scss';

const ErrorModal: React.FunctionComponent = () => (
  <>
    <div className={styles.errorModal}>
      <div className={styles.errorModalContent}>
        <RiErrorWarningLine size={100} />
        <p>Node is disconnected</p>
      </div>
    </div>
  </>
);

export default ErrorModal;
