import React, { useState } from 'react';
import { I18n } from 'react-redux-i18n';
import { Button, Input, Row, Col, Modal, ModalBody } from 'reactstrap';
import { MdLock } from 'react-icons/md';
import { connect } from 'react-redux';
import styles from './encryptWalletModel.module.scss';

import {
  closeEncryptWalletModal,
  encryptWalletStart,
} from '../../PopOver/reducer';

interface EncryptWalletModelProps {
  isEnrcyptWalletModalOpen: boolean;
  closeEncryptWalletModal: () => void;
  encryptWalletStart: (passphrase: string) => void;
}

const EncryptWalletModel: React.FunctionComponent<EncryptWalletModelProps> = (
  props: EncryptWalletModelProps
) => {
  const [state, setState] = useState({ passphrase: '', confirmPassphrase: '' });

  const onHandleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const { passphrase, confirmPassphrase } = state;

  const {
    isEnrcyptWalletModalOpen,
    closeEncryptWalletModal,
    encryptWalletStart,
  } = props;
  return (
    <Modal
      isOpen={isEnrcyptWalletModalOpen}
      contentClassName={styles.modalContent}
      backdropClassName={styles.modalBackdrop}
      style={{ width: '100%', maxWidth: '100vw' }}
      centered
    >
      <ModalBody>
        <div className={styles.lockSection}>
          <Row className='justify-content-center'>
            <Col md='6'>
              <div className='text-center'>
                <section>
                  <MdLock size={20} className={styles.lockIcon} />
                  <label className='text-center'>
                    {I18n.t('alerts.encryptWalletNotice')}
                  </label>

                  <div className='px-5'>
                    <Input
                      type='password'
                      value={passphrase}
                      name='passphrase'
                      id='passphraseLabel'
                      onChange={onHandleChange}
                      placeholder={I18n.t('alerts.passphraseLabel')}
                      className='mt-5'
                    />
                    <Input
                      type='password'
                      value={confirmPassphrase}
                      name='confirmPassphrase'
                      id='passphraseLabelConfirm'
                      onChange={onHandleChange}
                      placeholder={I18n.t('alerts.passphraseLabelConfirm')}
                      className='mt-5'
                    />
                  </div>
                  <div className='mt-4 text-center'>
                    <Button
                      size='sm'
                      className='ml-5'
                      color='link'
                      onClick={() => {
                        setState({
                          ...state,
                          passphrase: '',
                          confirmPassphrase: '',
                        });
                        closeEncryptWalletModal();
                      }}
                    >
                      {I18n.t('alerts.later')}
                    </Button>
                    <Button
                      size='sm'
                      color='primary'
                      disabled={
                        !confirmPassphrase ||
                        confirmPassphrase.length === 0 ||
                        confirmPassphrase !== passphrase
                      }
                      onClick={() => {
                        encryptWalletStart(passphrase);
                        setState({
                          ...state,
                          passphrase: '',
                          confirmPassphrase: '',
                        });
                      }}
                    >
                      {I18n.t('alerts.enableLocking')}
                    </Button>
                  </div>
                </section>
              </div>
            </Col>
          </Row>
        </div>
      </ModalBody>
    </Modal>
  );
};

const mapStateToProps = (state) => {
  const { isEnrcyptWalletModalOpen } = state.popover;

  return {
    isEnrcyptWalletModalOpen,
  };
};

const mapDispatchToProps = {
  closeEncryptWalletModal,
  encryptWalletStart: (passphrase: string) =>
    encryptWalletStart({ passphrase }),
};

export default connect(mapStateToProps, mapDispatchToProps)(EncryptWalletModel);
