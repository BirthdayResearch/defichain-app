import React from 'react';
import { I18n } from 'react-redux-i18n';
import { Button, Row, Col, Modal, ModalBody } from 'reactstrap';
import { MdLock } from 'react-icons/md';
import { connect } from 'react-redux';
import styles from './EncryptWalletModal.module.scss';
import { Controller, useForm } from 'react-hook-form';

import { closeEncryptWalletModal, encryptWalletStart } from '../reducer';
import InputPassword from '../../../components/InputPassword';

interface EncryptWalletModalProps {
  isEncryptWalletModalOpen: boolean;
  closeEncryptWalletModal: () => void;
  encryptWalletStart: (passphrase: string) => void;
}

enum EncryptWalletForm {
  passphrase = 'passphrase',
  confirmPassphrase = 'confirmPassphrase',
}

const EncryptWalletModal: React.FunctionComponent<EncryptWalletModalProps> = (
  props: EncryptWalletModalProps
) => {
  const { handleSubmit, control, getValues, formState, trigger } = useForm({
    mode: 'onChange',
  });

  const onHandleChange = (data) => {
    encryptWalletStart(data.passphrase);
  };

  const { isEncryptWalletModalOpen, closeEncryptWalletModal } = props;

  const isSameWithConfirm = () => {
    const values = getValues();
    const { dirtyFields } = formState;
    return (
      dirtyFields.confirmPassphrase &&
      dirtyFields.passphrase &&
      values.passphrase === values.confirmPassphrase
    );
  };
  const passwordValidationRules = {
    required: true,
    validate: {
      isSameWithConfirm: isSameWithConfirm,
    },
  };

  const onPasswordChange = (otherField: string) => {
    trigger(otherField);
  };

  return (
    <Modal
      isOpen={isEncryptWalletModalOpen}
      contentClassName={styles.modalContent}
      backdropClassName={styles.modalBackdrop}
      style={{ width: '100%', maxWidth: '100vw' }}
      centered
    >
      <ModalBody>
        <div className={styles.lockSection}>
          <Row className='justify-content-center'>
            <Col md='7'>
              <form onSubmit={handleSubmit(onHandleChange)}>
                <section>
                  <div className='d-flex flex-column align-items-center mb-4'>
                    <MdLock size={20} className={styles.lockIcon} />
                    <label className='text-center'>
                      {I18n.t('alerts.encryptWalletNotice')}
                    </label>
                  </div>

                  <div className='px-5'>
                    <Controller
                      name={EncryptWalletForm.passphrase}
                      control={control}
                      defaultValue=''
                      rules={passwordValidationRules}
                      render={({ onChange }, { invalid, isDirty }) => (
                        <InputPassword
                          label='alerts.passphraseLabel'
                          id='passphraseLabel'
                          name={EncryptWalletForm.passphrase}
                          onChange={(e) => {
                            onChange(e);
                            onPasswordChange(
                              EncryptWalletForm.confirmPassphrase
                            );
                          }}
                          invalid={invalid}
                          isDirty={isDirty}
                        />
                      )}
                    />
                    <Controller
                      name={EncryptWalletForm.confirmPassphrase}
                      control={control}
                      defaultValue=''
                      rules={passwordValidationRules}
                      render={({ onChange }, { invalid, isDirty }) => (
                        <InputPassword
                          label='alerts.passphraseLabelConfirm'
                          id='passphraseLabelConfirm'
                          name={EncryptWalletForm.confirmPassphrase}
                          onChange={(e) => {
                            onChange(e);
                            onPasswordChange(EncryptWalletForm.passphrase);
                          }}
                          invalid={invalid}
                          isDirty={isDirty}
                        />
                      )}
                    />
                  </div>

                  <label className='text-center'>
                    {I18n.t('alerts.encryptWalletWarning')}
                  </label>

                  <div className='mt-4 text-center'>
                    <Button
                      size='sm'
                      className='ml-5'
                      color='link'
                      onClick={() => {
                        closeEncryptWalletModal();
                      }}
                    >
                      {I18n.t('alerts.later')}
                    </Button>
                    <Button
                      size='sm'
                      color='primary'
                      type='submit'
                      disabled={!formState.isValid}
                    >
                      {I18n.t('alerts.enableLocking')}
                    </Button>
                  </div>
                </section>
              </form>
            </Col>
          </Row>
        </div>
      </ModalBody>
    </Modal>
  );
};

const mapStateToProps = (state) => {
  const { isEncryptWalletModalOpen } = state.popover;
  return {
    isEncryptWalletModalOpen,
  };
};

const mapDispatchToProps = {
  closeEncryptWalletModal,
  encryptWalletStart: (passphrase: string) =>
    encryptWalletStart({ passphrase }),
};

export default connect(mapStateToProps, mapDispatchToProps)(EncryptWalletModal);
