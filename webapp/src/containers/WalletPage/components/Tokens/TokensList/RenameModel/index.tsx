import React from 'react';
import { MdFileDownload } from 'react-icons/md';
import { I18n } from 'react-redux-i18n';
import {
  Modal,
  ModalBody,
  ModalFooter,
  Button,
  Col,
  FormGroup,
  Row,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
} from 'reactstrap';
import RenameRowInput from '../RenameRowInput';

interface RenameModelProps {
  toggles: () => void;
  renameModalOpen: boolean;
}

const RenameModel: React.FunctionComponent<RenameModelProps> = (
  props: RenameModelProps
) => {
  const { renameModalOpen, toggles } = props;

  return (
    <Modal isOpen={renameModalOpen} centered fade={false} toggle={toggles}>
      <ModalBody className='ml-3'>
        <Row className='mb-4 mt-2'>
          <Col>{I18n.t('containers.wallet.walletPage.renameWallet')}</Col>
        </Row>
        <Row>
          <Col md='12'>
            <FormGroup className='form-label-group'>
              <RenameRowInput
                fieldName={'blockHeight'}
                label={I18n.t('containers.wallet.walletPage.walletName')}
                value={I18n.t('containers.wallet.walletPage.myHappyWallet')}
                name={'blockHeight'}
                id={'maximumAmount'}
                placeholder={'text'}
              />
            </FormGroup>
          </Col>
        </Row>
      </ModalBody>
      <ModalFooter>
        <Button
          size='sm'
          color='link'
          className='ml-auto'
          onClick={() => toggles()}
        >
          {I18n.t('alerts.cancel')}
        </Button>
        <Button color='primary'>
          <span className='d-lg-inline'>
            {I18n.t('containers.wallet.walletPage.rename')}
          </span>
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default RenameModel;
