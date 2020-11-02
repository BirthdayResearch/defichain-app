import React, { useState } from 'react';
import defiIcon from '../../../assets/svg/defi-icon.svg';
import { I18n } from 'react-redux-i18n';
import { Button, Input, Row, Col, Modal, ModalBody } from 'reactstrap';
import {connect} from 'react-redux';

import styles from './walletPassphraseModel.module.scss';

import {
  closeWalletPassphraseModal, unlockWalletStart,
} from '../../PopOver/reducer';

interface WalletPassphraseModelProps {
  isWalletPassphraseModalOpen: boolean;
  closeWalletPassphraseModal: () => void;
  unlockWalletStart: (passphrase: string) => void;
}

const WalletPassphraseModel: React.FunctionComponent<WalletPassphraseModelProps> = (
  props: WalletPassphraseModelProps
) => {
  const [passphrase, setPassphrase] = useState('');

  const onHandleChange = (event) => {
    setPassphrase(event.target.value);
  };

  const { isWalletPassphraseModalOpen, closeWalletPassphraseModal, unlockWalletStart } = props;
  return (
    <Modal
      isOpen={isWalletPassphraseModalOpen}
      contentClassName={styles.modalContent}
      backdropClassName={styles.modalBackdrop}
      style={{ width: '100%', maxWidth: '100vw' }}
      centered
    >
      <ModalBody>
        <div className={styles.welcomeSection}>
          <Row className='justify-content-center'>
            <Col md='6'>
              <div className='text-center'>
                <section>
                  <img src={defiIcon} width='96px' height='96px'/>
                  <h3 className='mt-5'>{I18n.t('alerts.walletUnlockTitle')}</h3>
                  <p>{I18n.t('alerts.walletUnlockMessage')}</p>
                  <div className='d-flex mt-5'>
                    <Input
                      type='password'
                      value={passphrase}
                      name='passphrase'
                      id='passphraseLabel'
                      onChange={onHandleChange}
                      placeholder={I18n.t('alerts.enterYourPassphrase')}
                    />
                    <Button
                      size='sm'
                      color='primary'
                      className='ml-3'
                      disabled={passphrase.length === 0}
                      onClick={() => {
                        setPassphrase('');
                        unlockWalletStart(passphrase);
                        closeWalletPassphraseModal();
                      }}
                    >
                      {I18n.t('alerts.unlock')}
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
  const { isWalletPassphraseModalOpen } = state.popover;

  return {
    isWalletPassphraseModalOpen,
  };
};

const mapDispatchToProps = {
  closeWalletPassphraseModal,
  unlockWalletStart: (passphrase: string) =>
    unlockWalletStart({ passphrase }),
};

export default connect(mapStateToProps, mapDispatchToProps)(WalletPassphraseModel);
