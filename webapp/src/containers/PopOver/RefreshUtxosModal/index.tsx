import React from 'react';
import { connect } from 'react-redux';
import { Modal, ModalBody } from 'reactstrap';
import { I18n } from 'react-redux-i18n';
import Loader from '../../../components/Loader';
import styles from '../popOver.module.scss';

interface RefreshUtxosModalProps {
  isRefreshUtxosModalOpen: boolean;
}

const RefreshUtxosModal: React.FunctionComponent<RefreshUtxosModalProps> = (
  props: RefreshUtxosModalProps
) => {
  const { isRefreshUtxosModalOpen } = props;

  return (
    <Modal isOpen={isRefreshUtxosModalOpen} centered>
      <ModalBody>
        <div className={styles.errorModal}>
          <Loader className='mb-4' size={28} />
          <p>{I18n.t('alerts.refreshUtxos')}</p>
        </div>
      </ModalBody>
    </Modal>
  );
};

const mapStateToProps = (state) => {
  const { isRefreshUtxosModalOpen } = state.settings;

  return {
    isRefreshUtxosModalOpen,
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(RefreshUtxosModal);
