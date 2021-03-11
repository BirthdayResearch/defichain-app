import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap';
import { RootState } from '../../../app/rootTypes';
import { updateMasternodeStart } from '../../MasternodesPage/reducer';
import { openMasternodeUpdateRestartModal } from '../reducer';

const MasternodeUpdateRestartModal: React.FunctionComponent = () => {
  const {
    popover: { isMasternodeUpdateRestartModalOpen, updatedMasternode },
  } = useSelector((state: RootState) => state);
  const dispatch = useDispatch();
  return (
    <Modal isOpen={isMasternodeUpdateRestartModalOpen} centered>
      <ModalBody className='p-5 text-center'>
        <p className='mb-0'>
          {I18n.t('containers.masterNodes.masterNodesPage.restartNeeded')}
        </p>
      </ModalBody>
      <ModalFooter>
        <Button
          size='sm'
          color='link'
          onClick={() =>
            dispatch(
              openMasternodeUpdateRestartModal({
                isOpen: false,
                masternode: null,
              })
            )
          }
        >
          {I18n.t('alerts.cancel')}
        </Button>
        <Button
          size='sm'
          color='primary'
          onClick={() => {
            dispatch(updateMasternodeStart(updatedMasternode));
          }}
        >
          {I18n.t('alerts.yesRestartWalletNotice')}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default MasternodeUpdateRestartModal;
