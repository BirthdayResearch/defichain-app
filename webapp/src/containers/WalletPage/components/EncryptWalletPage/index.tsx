import React from 'react';
import { I18n } from 'react-redux-i18n';
import { Button, Row, Col } from 'reactstrap';
import { MdErrorOutline, MdLock } from 'react-icons/md';
import { connect } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';

import InputPassword from '../../../../components/InputPassword';

import styles from './encryptWalletPage.module.scss';
import {
  encryptWalletStart,
  encryptWalletFailure,
} from '../../../PopOver/reducer';
import Header from '../../../HeaderComponent';
import { Helmet } from 'react-helmet';
import { getPageTitle } from '../../../../utils/utility';
import { history } from '../../../../utils/history';
import { WALLET_TOKENS_PATH } from '../../../../constants';
import classnames from 'classnames';
import WalletLoadingFooter from '../../../../components/WalletLoadingFooter';

export interface EncryptWalletPayload {
  passphrase: string;
  isModal?: boolean;
  pageRedirect?: string;
}
export interface EncryptWalletPageProps {
  encryptWalletStart: (item: EncryptWalletPayload) => void;
  encryptWalletFailure: (err: string) => void;
  isWalletEncrypting: boolean;
  isErrorEncryptingWallet: string;
  pageSize?: number;
  isModal?: boolean;
  onClose?: () => void;
}

export enum EncryptWalletForm {
  passphrase = 'passphrase',
  confirmPassphrase = 'confirmPassphrase',
}

const EncryptWalletPage: React.FunctionComponent<EncryptWalletPageProps> = (
  props: EncryptWalletPageProps
) => {
  const { handleSubmit, control, getValues, formState, trigger } = useForm({
    mode: 'onChange',
  });

  const {
    onClose,
    encryptWalletStart,
    pageSize,
    isWalletEncrypting,
    isErrorEncryptingWallet,
    encryptWalletFailure,
    isModal,
  } = props;

  const onHandleChange = (data) => {
    encryptWalletStart({
      passphrase: data.passphrase,
      isModal,
      pageRedirect: WALLET_TOKENS_PATH,
    });
  };

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
    <div className='main-wrapper'>
      {!isModal && (
        <>
          <Helmet>
            <title>
              {getPageTitle(
                I18n.t('containers.wallet.encryptWalletPage.title')
              )}
            </title>
          </Helmet>
          <Header>
            <h1>{I18n.t('containers.wallet.encryptWalletPage.title')}</h1>
          </Header>
        </>
      )}
      <div className='content'>
        <section>
          <Row
            className={`justify-content-center container ${styles.lockSection}`}
          >
            <Col md={pageSize ?? 9}>
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
                      disabled={isWalletEncrypting}
                      onClick={() => {
                        onClose ? onClose() : history.push(WALLET_TOKENS_PATH);
                      }}
                    >
                      {I18n.t('alerts.later')}
                    </Button>
                    <Button
                      size='sm'
                      color='primary'
                      type='submit'
                      disabled={!formState.isValid || isWalletEncrypting}
                    >
                      {I18n.t('alerts.enableLocking')}
                    </Button>
                  </div>
                </section>
              </form>
            </Col>
          </Row>
        </section>
      </div>
      {!isModal &&
        (isWalletEncrypting ? (
          <>
            <footer className='footer-bar'>
              <WalletLoadingFooter
                message={I18n.t(
                  'containers.wallet.encryptWalletPage.encryptingWallet'
                )}
              />
            </footer>
            <div className={`footer-backdrop show-backdrop`} />
          </>
        ) : (
          isErrorEncryptingWallet.length !== 0 && (
            <footer className='footer-bar'>
              <div className={`footer-sheet`}>
                <div className='text-center'>
                  <MdErrorOutline
                    className={classnames({
                      'footer-sheet-icon': true,
                      [styles[`error-dialog`]]: true,
                    })}
                  />
                  <p>{isErrorEncryptingWallet}</p>
                </div>
              </div>
              <div className='d-flex align-items-center justify-content-center mb-5'>
                <Button
                  color='primary'
                  onClick={() => {
                    encryptWalletFailure('');
                  }}
                >
                  {I18n.t(
                    'containers.wallet.restoreWalletPage.backToWalletPage'
                  )}
                </Button>
              </div>
            </footer>
          )
        ))}
    </div>
  );
};

const mapStateToProps = (state) => {
  const {
    isEncryptWalletModalOpen,
    isWalletEncrypting,
    isErrorEncryptingWallet,
  } = state.popover;
  return {
    isWalletEncrypting,
    isEncryptWalletModalOpen,
    isErrorEncryptingWallet,
  };
};

const mapDispatchToProps = {
  encryptWalletStart,
  encryptWalletFailure,
};

export default connect(mapStateToProps, mapDispatchToProps)(EncryptWalletPage);
