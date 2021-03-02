import React from 'react';
import { I18n } from 'react-redux-i18n';
import { Button, Row, Col } from 'reactstrap';
import { MdArrowBack, MdErrorOutline, MdLock } from 'react-icons/md';
import { Controller, useForm } from 'react-hook-form';

import InputPassword from '../../../../components/InputPassword';

import styles from './encryptWalletPage.module.scss';
import Header from '../../../HeaderComponent';
import { Helmet } from 'react-helmet';
import { getPageTitle } from '../../../../utils/utility';
import { history } from '../../../../utils/history';
import { WALLET_TOKENS_PATH } from '../../../../constants';
import classnames from 'classnames';
import WalletLoadingFooter from '../../../../components/WalletLoadingFooter';
import { NavLink } from 'react-router-dom';
import {
  getPasswordStrength,
  getPasswordValidationRules,
  isSamePasswordValidation,
  PasswordForm,
  PasswordFormEnum,
} from '../../../../utils/passwordUtility';

export interface EncryptWalletPayload {
  passphrase: string;
  isModal?: boolean;
  pageRedirect?: string;
}
export interface EncryptWalletPageProps {
  onSave: (item: EncryptWalletPayload) => void;
  onCloseFailure: (err: string) => void;
  isPageLoading: boolean;
  submitButtonLabel: string;
  pageLoadingMessage: string;
  pageErrorMessage: string;
  pageSize?: number;
  isModal?: boolean;
  onClose?: () => void;
  pageTitle?: string;
}

const EncryptWalletPage: React.FunctionComponent<EncryptWalletPageProps> = (
  props: EncryptWalletPageProps
) => {
  const {
    onClose,
    pageSize,
    isPageLoading,
    pageErrorMessage,
    onCloseFailure,
    submitButtonLabel,
    isModal,
    pageTitle,
    onSave,
    pageLoadingMessage,
  } = props;

  const { handleSubmit, control, getValues, formState, trigger } = useForm({
    mode: 'onChange',
  });

  const onFormSubmit = (data) => {
    const payload = {
      passphrase: data.passphrase,
      isModal,
      pageRedirect: WALLET_TOKENS_PATH,
    };
    onSave(payload);
  };

  const isSameWithConfirm = () => {
    const values = getValues();
    const { dirtyFields } = formState;
    return isSamePasswordValidation(
      values as PasswordForm,
      dirtyFields as PasswordForm
    );
  };

  const onPasswordChange = (otherField: string) => {
    trigger(otherField);
  };

  const pageTitleValue = I18n.t(
    pageTitle ?? 'containers.wallet.createNewWalletPage.createANewWallet'
  );

  return (
    <div className='main-wrapper'>
      {!isModal && (
        <>
          <Helmet>
            <title>{getPageTitle(pageTitleValue)}</title>
          </Helmet>
          <Header>
            <Button
              to={WALLET_TOKENS_PATH}
              tag={NavLink}
              color='link'
              className='header-bar-back'
            >
              <MdArrowBack />
              <span className='d-lg-inline'>
                {I18n.t('containers.wallet.createNewWalletPage.back')}
              </span>
            </Button>
            <h1 className={classnames({ 'd-none': false })}>
              {pageTitleValue}
            </h1>
          </Header>
        </>
      )}
      <div className='content'>
        <section>
          <Row
            className={`justify-content-center container ${styles.lockSection}`}
          >
            <Col md={pageSize ?? 9}>
              <form onSubmit={handleSubmit(onFormSubmit)}>
                <section>
                  <div className='d-flex flex-column align-items-center mb-4'>
                    <MdLock size={20} className={styles.lockIcon} />
                    <label className='text-center'>
                      {I18n.t('alerts.encryptWalletNotice')}
                    </label>
                  </div>

                  <div className='px-5'>
                    <Controller
                      name={PasswordFormEnum.passphrase}
                      control={control}
                      defaultValue=''
                      rules={getPasswordValidationRules(
                        isSameWithConfirm,
                        true
                      )}
                      render={({ onChange, value }, { invalid, isDirty }) => (
                        <InputPassword
                          label='alerts.passphraseLabel'
                          id='passphraseLabel'
                          hasStrengthChecker={true}
                          strengthScore={getPasswordStrength(value)}
                          name={PasswordFormEnum.passphrase}
                          onChange={(e) => {
                            onChange(e);
                            onPasswordChange(
                              PasswordFormEnum.confirmPassphrase
                            );
                          }}
                          invalid={invalid}
                          isDirty={isDirty}
                        />
                      )}
                    />
                    <Controller
                      name={PasswordFormEnum.confirmPassphrase}
                      control={control}
                      defaultValue=''
                      rules={getPasswordValidationRules(
                        isSameWithConfirm,
                        false
                      )}
                      render={({ onChange }, { invalid, isDirty }) => (
                        <InputPassword
                          label='alerts.passphraseLabelConfirm'
                          id='passphraseLabelConfirm'
                          name={PasswordFormEnum.confirmPassphrase}
                          onChange={(e) => {
                            onChange(e);
                            onPasswordChange(PasswordFormEnum.passphrase);
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
                    {isModal && (
                      <Button
                        size='sm'
                        className='ml-5'
                        color='link'
                        disabled={isPageLoading}
                        onClick={() => {
                          onClose
                            ? onClose()
                            : history.push(WALLET_TOKENS_PATH);
                        }}
                      >
                        {I18n.t('alerts.later')}
                      </Button>
                    )}
                    <Button
                      size='sm'
                      color='primary'
                      type='submit'
                      disabled={!formState.isValid || isPageLoading}
                    >
                      {I18n.t(submitButtonLabel)}
                    </Button>
                  </div>
                </section>
              </form>
            </Col>
          </Row>
        </section>
      </div>
      {!isModal &&
        (isPageLoading ? (
          <>
            <footer className='footer-bar'>
              <WalletLoadingFooter message={I18n.t(pageLoadingMessage)} />
            </footer>
            <div className={`footer-backdrop show-backdrop`} />
          </>
        ) : (
          pageErrorMessage.length !== 0 && (
            <footer className='footer-bar'>
              <div className={`footer-sheet`}>
                <div className='text-center'>
                  <MdErrorOutline
                    className={classnames({
                      'footer-sheet-icon': true,
                      [styles[`error-dialog`]]: true,
                    })}
                  />
                  <p>{pageErrorMessage}</p>
                </div>
              </div>
              <div className='d-flex align-items-center justify-content-center mb-5'>
                <Button
                  color='primary'
                  onClick={() => {
                    onCloseFailure('');
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

export default EncryptWalletPage;
