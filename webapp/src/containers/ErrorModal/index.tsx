import React from 'react';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import { RiErrorWarningLine, RiLoader4Line } from 'react-icons/ri';
import Loader from '../../components/Loader';
import styles from './errorModal.module.scss';

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
          <RiErrorWarningLine size={100} />
          <p>{I18n.t('alerts.nodeDisconnected')}</p>
        </div>
      )}
      {props.isRestart && (
        <div>
          <Loader
            className='mb-5'
            size={100}
            color={'#ff0000'}
            borderSize={10}
          />
          <p>{I18n.t('alerts.restartNode')}</p>
        </div>
      )}
    </div>
  </>
);
const mapStateToProps = (state) => {
  const { isRestart, showWarning } = state.errorModal;
  return {
    isRestart,
    showWarning,
  };
};

export default connect(mapStateToProps)(ErrorModal);
