import React from 'react';
import LaunchLogo from '../../../../components/Svg/Launch';
import { I18n } from 'react-redux-i18n';
import { Button, Row, Col } from 'reactstrap';

import styles from './walletPassphrasePage.module.scss';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { getPageTitle } from '../../../../utils/utility';
import Header from '../../../HeaderComponent';
import { Controller, useForm } from 'react-hook-form';
import InputPassword from '../../../../components/InputPassword';
import { EncryptWalletForm, EncryptWalletPayload } from '../EncryptWalletPage';
import { unlockWalletFailure, unlockWalletStart } from '../../reducer';
import { history } from '../../../../utils/history';
import {
  WALLET_TOKENS_PATH,
  WALLET_UNLOCK_TIMEOUT,
} from '../../../../constants';
import classnames from 'classnames';
import { MdErrorOutline } from 'react-icons/md';

export interface WalletPassphrasePayload extends EncryptWalletPayload {
  timeout: number;
}

export interface WalletPassphrasePageProps {
  isModal?: boolean;
  pageSize?: number;
  originalPage?: string;
  isErrorUnlockWallet: string;
  onClose?: () => void;
  unlockWalletStart: (item: WalletPassphrasePayload) => void;
  unlockWalletFailure: (message: string) => void;
}

const WalletPassphrasePage: React.FunctionComponent<WalletPassphrasePageProps> = (
  props: WalletPassphrasePageProps
) => {
  const { handleSubmit, control, formState } = useForm({
    mode: 'onChange',
  });
  const passwordValidationRules = {
    required: true,
  };
  const onHandleChange = (data) => {
    unlockWalletStart({
      passphrase: data.passphrase,
      isModal,
      pageRedirect: originalPage ?? WALLET_TOKENS_PATH,
      timeout: WALLET_UNLOCK_TIMEOUT,
    });
  };
  const {
    isModal,
    pageSize,
    originalPage,
    onClose,
    unlockWalletStart,
    isErrorUnlockWallet,
    unlockWalletFailure,
  } = props;
  return (
    <div className='main-wrapper'>
      {!isModal && (
        <>
          <Helmet>
            <title>
              {getPageTitle(I18n.t('containers.wallet.unlockWalletPage.title'))}
            </title>
          </Helmet>
          <Header>
            <h1>{I18n.t('containers.wallet.unlockWalletPage.title')}</h1>
          </Header>
        </>
      )}
      <div className='content'>
        <section>
          <Row className='justify-content-center'>
            <Col md={pageSize ?? 9}>
              <form onSubmit={handleSubmit(onHandleChange)}>
                <section className={styles.passphraseContainer}>
                  <LaunchLogo isNotAnimated={true} />
                  {isModal && (
                    <h2 className='mb-0'>
                      {I18n.t('alerts.walletUnlockTitle')}
                    </h2>
                  )}
                  <h6 className='mb-2'>
                    {I18n.t('alerts.walletUnlockMessage')}
                  </h6>
                  <div className={styles.passphraseField}>
                    <Controller
                      name={EncryptWalletForm.passphrase}
                      control={control}
                      defaultValue=''
                      rules={passwordValidationRules}
                      render={({ onChange }, { invalid, isDirty }) => (
                        <InputPassword
                          label='alerts.enterYourPassphrase'
                          id='passphraseLabel'
                          name={EncryptWalletForm.passphrase}
                          onChange={(e) => {
                            onChange(e);
                          }}
                          invalid={invalid}
                          isDirty={isDirty}
                        />
                      )}
                    />
                    <div>
                      <Button
                        size='md'
                        color='primary'
                        type='submit'
                        disabled={!formState.isValid}
                        className='ml-3'
                      >
                        {I18n.t('alerts.unlock')}
                      </Button>
                    </div>
                  </div>
                  {isModal && isErrorUnlockWallet.length !== 0 && (
                    <h6
                      className={classnames({
                        [styles[`error-dialog`]]: true,
                      })}
                    >
                      {isErrorUnlockWallet}
                    </h6>
                  )}
                  <div className='text-center'>
                    <Button
                      size='md'
                      color='link'
                      onClick={() => {
                        onClose
                          ? onClose()
                          : history.push(originalPage || WALLET_TOKENS_PATH);
                      }}
                    >
                      {I18n.t('alerts.later')}
                    </Button>
                  </div>
                </section>
              </form>
            </Col>
          </Row>
        </section>
      </div>
      {!isModal && isErrorUnlockWallet.length !== 0 && (
        <footer className='footer-bar'>
          <div className={`footer-sheet`}>
            <div className='text-center'>
              <MdErrorOutline
                className={classnames({
                  'footer-sheet-icon': true,
                  [styles[`error-dialog`]]: true,
                })}
              />
              <p>{isErrorUnlockWallet}</p>
            </div>
          </div>
          <div className='d-flex align-items-center justify-content-center mb-5'>
            <Button
              color='primary'
              onClick={() => {
                unlockWalletFailure('');
              }}
            >
              {I18n.t('containers.wallet.restoreWalletPage.backToWalletPage')}
            </Button>
          </div>
        </footer>
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  const { isEncryptWalletModalOpen, isWalletEncrypting } = state.popover;
  const { isErrorUnlockWallet } = state.wallet;
  return {
    isWalletEncrypting,
    isEncryptWalletModalOpen,
    isErrorUnlockWallet,
  };
};

const mapDispatchToProps = {
  unlockWalletStart,
  unlockWalletFailure,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WalletPassphrasePage);
