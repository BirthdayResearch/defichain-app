import React from 'react';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import { RiErrorWarningLine } from 'react-icons/ri';
import Loader from '../../../components/Loader';
import styles from '../popOver.module.scss';

interface ErrorModalProps {
  isRestart: boolean;
  showWarning: boolean;
}

const ErrorModal: React.FunctionComponent<ErrorModalProps> = (
  props: ErrorModalProps
) => (
  <>
    <div className={styles.errorModal}>
      {!props.isRestart && props.showWarning && (
        <div className={styles.errorModalContent}>
          <RiErrorWarningLine size={50} />
          <p>{I18n.t('alerts.nodeDisconnected')}</p>
        </div>
      )}
      {props.isRestart && (
        <div>
          <Loader className='mb-4' size={28} />
          <p>{I18n.t('alerts.restartNode')}</p>
        </div>
      )}
    </div>
  </>
);

const mapStateToProps = (state) => {
  const { isRestart, showWarning } = state.popover;
  return {
    isRestart,
    showWarning,
  };
};

export default connect(mapStateToProps)(ErrorModal);
