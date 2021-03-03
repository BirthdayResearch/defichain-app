import React from 'react';
import { I18n } from 'react-redux-i18n';
import { Button, Row, Col } from 'reactstrap';
import { MdArrowBack, MdErrorOutline } from 'react-icons/md';
import { Controller, useForm } from 'react-hook-form';

import InputPassword from '../../../../components/InputPassword';

import styles from './settingsChangePassphrase.module.scss';
import Header from '../../../HeaderComponent';
import { Helmet } from 'react-helmet';
import { getPageTitle } from '../../../../utils/utility';
import { history } from '../../../../utils/history';
import classnames from 'classnames';
import WalletLoadingFooter from '../../../../components/WalletLoadingFooter';
import { useDispatch, useSelector } from 'react-redux';
import {
  changePassphraseFailure,
  changePassphraseRequest,
} from '../../reducer';
import { SETTING_PATH } from '../../../../constants';
import { SettingsTabs } from '../SettingsTabHeader';
import {
  currentPasswordValidation,
  getPasswordValidationRules,
  isSamePasswordValidation,
  PasswordForm,
  PasswordFormEnum,
  getPasswordStrength,
} from '../../../../utils/passwordUtility';
import { RootState } from '../../../../app/rootTypes';

const SettingsChangePassphrase: React.FunctionComponent = () => {
  const { handleSubmit, control, getValues, formState, trigger } = useForm({
    mode: 'onChange',
  });

  const dispatch = useDispatch();
  const { isPassphraseChanging, changePassphraseError } = useSelector(
    (state: RootState) => state.settings
  );

  const onFormSubmit = (data) => {
    const payload = {
      currentPassphrase: data.currentPassphrase,
      passphrase: data.passphrase,
    };
    dispatch(changePassphraseRequest(payload));
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

  const pageTitleValue = I18n.t('containers.settings.changeLockPassphrase');

  return (
    <div className='main-wrapper'>
      <Helmet>
        <title>{getPageTitle(pageTitleValue)}</title>
      </Helmet>
      <Header>
        <Button
          onClick={() =>
            history.push(`${SETTING_PATH}?tab=${SettingsTabs.security}`)
          }
          color='link'
          className='header-bar-back'
        >
          <MdArrowBack />
          <span className='d-lg-inline'>
            {I18n.t('containers.wallet.createNewWalletPage.back')}
          </span>
        </Button>
        <h1 className={classnames({ 'd-none': false })}>{pageTitleValue}</h1>
      </Header>

      <form onSubmit={handleSubmit(onFormSubmit)} className={styles.formClass}>
        <div className='content'>
          <section>
            <Row>
              <Col md={12}>
                <h4 className='mb-5'>
                  {I18n.t('alerts.encryptWalletWarning')}
                </h4>
              </Col>
            </Row>
            <Row>
              <Col md={12} className='mb-3'>
                <Controller
                  name={PasswordFormEnum.currentPassphrase}
                  control={control}
                  defaultValue=''
                  rules={currentPasswordValidation}
                  render={({ onChange }, { invalid, isDirty }) => (
                    <InputPassword
                      label='containers.settings.currentPassphrase'
                      id={PasswordFormEnum.currentPassphrase}
                      name={PasswordFormEnum.currentPassphrase}
                      onChange={(e) => {
                        onChange(e);
                      }}
                      invalid={invalid}
                      isDirty={isDirty}
                    />
                  )}
                />
              </Col>
            </Row>
            <Row>
              <Col md={12} className='mb-3'>
                <Controller
                  name={PasswordFormEnum.passphrase}
                  control={control}
                  defaultValue=''
                  rules={getPasswordValidationRules(isSameWithConfirm, true)}
                  render={({ onChange, value }, { invalid, isDirty }) => (
                    <InputPassword
                      label='containers.settings.newPassphrase'
                      id={PasswordFormEnum.passphrase}
                      hasStrengthChecker={true}
                      strengthScore={getPasswordStrength(value)}
                      name={PasswordFormEnum.passphrase}
                      onChange={(e) => {
                        onChange(e);
                        onPasswordChange(PasswordFormEnum.confirmPassphrase);
                      }}
                      invalid={invalid}
                      isDirty={isDirty}
                    />
                  )}
                />
              </Col>
            </Row>
            <Row>
              <Col md={12} className='mb-3'>
                <Controller
                  name={PasswordFormEnum.confirmPassphrase}
                  control={control}
                  defaultValue=''
                  rules={getPasswordValidationRules(isSameWithConfirm, false)}
                  render={({ onChange }, { invalid, isDirty }) => (
                    <InputPassword
                      label='containers.settings.confirmNewPassphrase'
                      id={PasswordFormEnum.confirmPassphrase}
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
              </Col>
            </Row>
          </section>
        </div>
        {isPassphraseChanging && (
          <div className={`footer-backdrop show-backdrop`} />
        )}
        <footer className='footer-bar dark-bg'>
          {isPassphraseChanging ? (
            <>
              <WalletLoadingFooter
                message={I18n.t('containers.settings.updatingPassphrase')}
              />
            </>
          ) : changePassphraseError.length !== 0 ? (
            <>
              <div className={`footer-sheet`}>
                <div className='text-center'>
                  <MdErrorOutline
                    className={classnames({
                      'footer-sheet-icon': true,
                      [styles[`error-dialog`]]: true,
                    })}
                  />
                  <p>{changePassphraseError}</p>
                </div>
              </div>
              <div className='d-flex align-items-center justify-content-center mb-5'>
                <Button
                  color='primary'
                  onClick={() => {
                    dispatch(changePassphraseFailure(''));
                  }}
                >
                  {I18n.t(
                    'containers.wallet.restoreWalletPage.backToWalletPage'
                  )}
                </Button>
              </div>
            </>
          ) : (
            <Row className='justify-content-between align-items-center'>
              <Col className='d-flex justify-content-end'>
                <Button
                  onClick={() =>
                    history.push(`${SETTING_PATH}?tab=${SettingsTabs.security}`)
                  }
                  color='link'
                  disabled={isPassphraseChanging}
                >
                  {I18n.t('alerts.cancel')}
                </Button>
                <Button
                  color='primary'
                  type='submit'
                  disabled={!formState.isValid || isPassphraseChanging}
                >
                  {I18n.t('containers.settings.save')}
                </Button>
              </Col>
            </Row>
          )}
        </footer>
      </form>
    </div>
  );
};

export default SettingsChangePassphrase;
