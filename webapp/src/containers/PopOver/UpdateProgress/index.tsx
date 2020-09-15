import React from 'react';
import { Modal, ModalBody } from 'reactstrap';
import UpdateProgressComponent from './UpdateProgressComponent';
import styles from '../popOver.module.scss';
import { connect } from 'react-redux';

interface UpdateProgressModalProps {
  isUpdateModalOpen: boolean;
}

const UpdateProgressModal = (props: UpdateProgressModalProps) => {
  return (
    <Modal
      isOpen={props.isUpdateModalOpen}
      centered
      contentClassName={styles.onContentModal}
    >
      <ModalBody>
        <UpdateProgressComponent />
      </ModalBody>
    </Modal>
  );
};

const mapStateToProps = ({ popover }) => ({
  isUpdateModalOpen: popover.isUpdateModalOpen,
});

export default connect(mapStateToProps)(UpdateProgressModal);
