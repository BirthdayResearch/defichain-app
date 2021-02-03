import React, { useState } from 'react';
import { I18n } from 'react-redux-i18n';
import {
  Button,
  Input,
  Row,
  Col,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
} from 'reactstrap';
import { MdLock } from 'react-icons/md';

import styles from './encryptWalletPage.module.scss';

interface EncryptWalletModalProps {}

const EncryptWalletModal: React.FunctionComponent<EncryptWalletModalProps> = (
  props: EncryptWalletModalProps
) => {
  const [state, setState] = useState({ passphrase: '', confirmPassphrase: '' });

  const onHandleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const { passphrase, confirmPassphrase } = state;
  return (
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
                <InputGroup>
                  <Input
                    type='password'
                    name='passphrase'
                    id='passphraseLabel'
                    placeholder={I18n.t('alerts.passphraseLabel')}
                    value={passphrase}
                    onChange={onHandleChange}
                  />
                  <Label for='passphraseLabel'>
                    {I18n.t('alerts.passphraseLabel')}
                  </Label>
                </InputGroup>

                <InputGroup>
                  <Input
                    type='password'
                    name='confirmPassphrase'
                    id='passphraseLabelConfirm'
                    placeholder={I18n.t('alerts.passphraseLabelConfirm')}
                    value={confirmPassphrase}
                    onChange={onHandleChange}
                  />
                  <Label for='passphraseLabelConfirm'>
                    {I18n.t('alerts.passphraseLabelConfirm')}
                  </Label>
                </InputGroup>
              </div>
              <label className='text-center'>
                {I18n.t('alerts.encryptWalletWarning')}
              </label>
              <div className='mt-4 text-center'>
                <Button size='sm' className='ml-5' color='link'>
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
                >
                  {I18n.t('alerts.enableLocking')}
                </Button>
              </div>
            </section>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default EncryptWalletModal;
