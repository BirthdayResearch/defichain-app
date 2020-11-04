import React, { useState } from 'react';
import { I18n } from 'react-redux-i18n';
import { Button, Input, Row, Col } from 'reactstrap';
import { MdLock } from 'react-icons/md';

import styles from './encryptWalletPage.module.scss';

interface EncryptWalletModelProps {}

const EncryptWalletModel: React.FunctionComponent<EncryptWalletModelProps> = (
  props: EncryptWalletModelProps
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

export default EncryptWalletModel;
