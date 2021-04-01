import React, { useState } from 'react';
import { I18n } from 'react-redux-i18n';
import {
  Button,
  Row,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from 'reactstrap';

import styles from './walletPassphrasePage.module.scss';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { getPageTitle } from '../../../../utils/utility';
import Header from '../../../HeaderComponent';
import { Controller, useForm } from 'react-hook-form';
import InputPassword from '../../../../components/InputPassword';
import { EncryptWalletPayload } from '../EncryptWalletPage';
import { unlockWalletFailure, unlockWalletStart } from '../../reducer';
import { history } from '../../../../utils/history';
import { WALLET_TOKENS_PATH } from '../../../../constants';
import classnames from 'classnames';
import { MdCheck, MdErrorOutline, MdLockOpen } from 'react-icons/md';
import {
  currentPasswordValidation,
  PasswordFormEnum,
} from '../../../../utils/passwordUtility';
import { RootState } from '../../../../app/rootTypes';
import { MasterNodeObject } from '../../../MasternodesPage/masterNodeInterface';
import { TimeoutLockEnum } from '../../../SettingsPage/types';
import { getDropdownLabel } from '../../../SettingsPage/components/SettingsRowDropDown';
import {
  MaxTimeout,
  TimeoutLockList,
} from '../../../SettingsPage/components/SettingsTabSecurity';
import { useEffect } from 'react';
import { hasAnyMasternodeEnabled } from '../../../MasternodesPage/service';

export interface WalletPassphrasePayload extends EncryptWalletPayload {
  timeout: number;
}

export interface WalletPassphrasePageProps {
  isModal?: boolean;
  pageSize?: number;
  originalPage?: string;
  isErrorUnlockWallet: string;
  defaultLockTimeout: number;
  onClose?: () => void;
  unlockWalletStart: (item: WalletPassphrasePayload) => void;
  unlockWalletFailure: (message: string) => void;
  myMasternodes: MasterNodeObject[];
}

const WalletPassphrasePage: React.FunctionComponent<WalletPassphrasePageProps> = (
  props: WalletPassphrasePageProps
) => {
  const { handleSubmit, control, formState } = useForm({
    mode: 'onChange',
  });
  const onHandleChange = (data) => {
    unlockWalletStart({
      passphrase: data.passphrase,
      isModal,
      pageRedirect: originalPage ?? WALLET_TOKENS_PATH,
      timeout: timeoutValue,
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
    defaultLockTimeout,
    myMasternodes,
  } = props;

  const [timeoutLockList, setTimeoutLockList] = useState(TimeoutLockList);
  const [timeoutValue, setTimeoutValue] = useState(defaultLockTimeout);

  const hasMasterNodes = (): boolean => {
    return hasAnyMasternodeEnabled(myMasternodes);
  };

  useEffect(() => {
    if (hasMasterNodes()) {
      setTimeoutLockList([...TimeoutLockList, { ...MaxTimeout }]);
      setTimeoutValue(MaxTimeout.value);
    }
  }, [myMasternodes?.length]);

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
                  <MdLockOpen size={20} className={styles.lockIcon} />
                  <h6 className='mb-2'>
                    <span>
                      {I18n.t(
                        hasMasterNodes()
                          ? 'alerts.walletUnlockMasternodeMessage'
                          : 'alerts.walletUnlockMessage'
                      )}
                    </span>
                  </h6>
                  <div className={styles.passphraseField}>
                    <Controller
                      name={PasswordFormEnum.passphrase}
                      control={control}
                      defaultValue=''
                      rules={currentPasswordValidation}
                      render={({ onChange }, { invalid, isDirty }) => (
                        <InputPassword
                          label='alerts.enterYourPassphrase'
                          id='passphraseLabel'
                          name={PasswordFormEnum.passphrase}
                          onChange={(e) => {
                            onChange(e);
                          }}
                          invalid={invalid}
                          isDirty={isDirty}
                        />
                      )}
                    />
                  </div>
                  <div className={classnames({ fullWidthDropdown: true })}>
                    <UncontrolledDropdown>
                      <DropdownToggle
                        disabled={hasMasterNodes()}
                        caret
                        color='outline-secondary'
                      >
                        {I18n.t(
                          getDropdownLabel(timeoutLockList, timeoutValue)
                        )}
                      </DropdownToggle>
                      <DropdownMenu>
                        {timeoutLockList.map((object) => {
                          return (
                            <DropdownItem
                              className='d-flex justify-content-between'
                              key={object.value}
                              onClick={() => {
                                setTimeoutValue(object.value);
                              }}
                              value={object.value}
                            >
                              <span>{I18n.t(object.label)}</span>
                              &nbsp;
                              {timeoutValue === object.value && <MdCheck />}
                            </DropdownItem>
                          );
                        })}
                      </DropdownMenu>
                    </UncontrolledDropdown>
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
                      {I18n.t('alerts.cancel')}
                    </Button>
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

const mapStateToProps = (state: RootState) => {
  const { isEncryptWalletModalOpen, isWalletEncrypting } = state.popover;
  const { isErrorUnlockWallet } = state.wallet;
  const { defaultLockTimeout } = state.settings;
  const { myMasternodes } = state.masterNodes;
  return {
    isWalletEncrypting,
    isEncryptWalletModalOpen,
    isErrorUnlockWallet,
    defaultLockTimeout,
    myMasternodes,
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
