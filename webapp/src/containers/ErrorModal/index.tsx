import React from 'react';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import { RiErrorWarningLine, RiLoader4Line } from 'react-icons/ri';
import styles from './errorModal.module.scss';

interface ErrorModalProps {
  isRestart: boolean;
}

const ErrorModal: React.FunctionComponent<ErrorModalProps> = (
  props: ErrorModalProps
) => (
  <>
    <div className={styles.errorModal}>
      {!props.isRestart ? (
        <div className={styles.errorModalContent}>
          <RiErrorWarningLine size={100} />
          <p>{I18n.t('alerts.nodeDisconnected')}</p>
        </div>
      ) : (
        <div className={styles.errorLoaderContent}>
          <RiLoader4Line size={100} />
          <p>{I18n.t('alerts.restartNode')}</p>
        </div>
      )}
    </div>
  </>
);
const mapStateToProps = (state) => {
  const { isRestart } = state.errorModal;
  return {
    isRestart,
  };
};

export default connect(mapStateToProps)(ErrorModal);
