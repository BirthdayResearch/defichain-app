import React from 'react';
import ErrorComponent from './ErrorModal';
import { connect } from 'react-redux';
import { Modal, ModalBody } from 'reactstrap';
import styles from '../popOver.module.scss';

interface ErrorModalProps {
  isOpen: boolean;
}

function ErrorModal(props: ErrorModalProps) {
  return (
    <Modal
      isOpen={props.isOpen}
      centered
      contentClassName={styles.onContentModal}
    >
      <ModalBody>
        <ErrorComponent />
      </ModalBody>
    </Modal>
  );
}

const mapStateToProps = ({ popover }) => ({
  isOpen: popover.isOpen,
});

export default connect(mapStateToProps)(ErrorModal);
