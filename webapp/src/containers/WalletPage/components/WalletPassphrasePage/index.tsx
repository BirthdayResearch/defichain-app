import React, { useState } from 'react';
import LaunchLogo from '../../../../components/Svg/Launch';
import { I18n } from 'react-redux-i18n';
import { Button, Input, Row, Col } from 'reactstrap';

import styles from './walletPassphrasePage.module.scss';

interface WalletPassphraseModelProps {}

const WalletPassphraseModel: React.FunctionComponent<WalletPassphraseModelProps> = (
  props: WalletPassphraseModelProps
) => {
  const [passphrase, setPassphrase] = useState('');

  const onHandleChange = (event) => {
    setPassphrase(event.target.value);
  };
  return (
    <div className={styles.welcomeSection}>
      <Row className='justify-content-center'>
        <Col md='6'>
          <div className='text-center'>
            <section>
              <LaunchLogo />
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
                  disabled={passphrase.length === 0}
                  className='ml-3'
                >
                  {I18n.t('alerts.unlock')}
                </Button>
              </div>
              <div className='mt-5 text-primary'>
                {I18n.t('alerts.lostPassphraseMessage')}
              </div>
            </section>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default WalletPassphraseModel;
