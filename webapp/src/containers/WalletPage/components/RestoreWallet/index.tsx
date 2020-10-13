import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { MdArrowBack, MdErrorOutline } from 'react-icons/md';
import { I18n } from 'react-redux-i18n';
import { NavLink, RouteComponentProps } from 'react-router-dom';
import {
  Button,
  Col,
  Row,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from 'reactstrap';
import classnames from 'classnames';

import styles from './RestoreWallet.module.scss';
import { WALLET_PAGE_PATH } from '../../../../constants';
import { resetRestoreWalletError, restoreWalletRequest } from '../../reducer';
import { connect } from 'react-redux';
import WalletLoadingFooter from '../../../../components/WalletLoadingFooter';

interface RestoreWalletProps extends RouteComponentProps {
  isWalletRestoring: boolean;
  isErrorRestoringWallet: string;
  restoreWallet: (mnemonicObj: any, history: any) => void;
  resetRestoreWalletError: () => void;
}

const RestoreWallet: React.FunctionComponent<RestoreWalletProps> = (
  props: RestoreWalletProps
) => {
  const [mnemonicObj, setMnemonicObj] = useState({
    '1': '',
    '2': '',
    '3': '',
    '4': '',
    '5': '',
    '6': '',
    '7': '',
    '8': '',
    '9': '',
    '10': '',
    '11': '',
    '12': '',
    '13': '',
    '14': '',
    '15': '',
    '16': '',
    '17': '',
    '18': '',
    '19': '',
    '20': '',
    '21': '',
    '22': '',
    '23': '',
    '24': '',
  });

  const [mnemonicCheck, setMnemonicCheck] = useState(false);

  const onchangeHandle = (event, key) => {
    const tempObj = { ...mnemonicObj, [key]: event.target.value };
    setMnemonicObj(tempObj);

    const isFilled = isMnemonicObjFilled(tempObj);
    setMnemonicCheck(isFilled);
  };

  const isMnemonicObjFilled = (object): boolean => {
    // check wether there is an empty text field, if yes then return false
    return !Object.values(object).includes('');
  };

  const {
    restoreWallet,
    resetRestoreWalletError,
    isWalletRestoring,
    isErrorRestoringWallet,
    history,
  } = props;

  useEffect(() => {
    props.resetRestoreWalletError();
  }, []);

  return (
    <div className='main-wrapper'>
      <Helmet>
        <title>{I18n.t('containers.wallet.restoreWalletPage.title')}</title>
      </Helmet>
      <header className='header-bar'>
        <Button
          to={WALLET_PAGE_PATH}
          tag={NavLink}
          color='link'
          className='header-bar-back'
        >
          <MdArrowBack />
          <span className='d-lg-inline'>
            {I18n.t('containers.wallet.restoreWalletPage.back')}
          </span>
        </Button>
        <h1 className={classnames({ 'd-none': false })}>
          {I18n.t('containers.wallet.restoreWalletPage.restoreWallet')}
        </h1>
      </header>
      <div className='content'>
        <section>
          <p>
            {I18n.t(
              'containers.wallet.restoreWalletPage.restoreWalletGuideLine'
            )}
          </p>
        </section>
        <Row>
          {Object.keys(mnemonicObj).map((key) => (
            <Col md='4' key={key}>
              <Row>
                <InputGroup className='m-2'>
                  <InputGroupAddon addonType='prepend'>
                    <InputGroupText className={styles.inputNumber}>
                      {key}
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder='Enter word'
                    value={mnemonicObj[key]}
                    onChange={(event) => onchangeHandle(event, key)}
                    className='border-left-0'
                  />
                </InputGroup>
              </Row>
            </Col>
          ))}
        </Row>
      </div>
      <footer className='footer-bar'>
        {isWalletRestoring ? (
          <WalletLoadingFooter
            message={I18n.t(
              'containers.wallet.restoreWalletPage.restoringWallet'
            )}
          />
        ) : isErrorRestoringWallet.length !== 0 ? (
          <>
            <div className={`footer-sheet`}>
              <div className='text-center'>
                <MdErrorOutline
                  className={classnames({
                    'footer-sheet-icon': true,
                    [styles[`error-dailog`]]: true,
                  })}
                />
                <p>{isErrorRestoringWallet}</p>
              </div>
            </div>
            <div className='d-flex align-items-center justify-content-center'>
              <Button
                color='primary'
                onClick={() => {
                  resetRestoreWalletError();
                  history.push(WALLET_PAGE_PATH);
                }}
              >
                {I18n.t('containers.wallet.restoreWalletPage.backToWalletPage')}
              </Button>
            </div>
          </>
        ) : (
          <div>
            <Row className='justify-content-between align-items-center'>
              <Col className='d-flex justify-content-end'>
                <Button
                  color='link'
                  className='mr-3'
                  disabled={!mnemonicCheck}
                  onClick={() => {
                    restoreWallet(mnemonicObj, history);
                  }}
                >
                  {I18n.t('containers.wallet.restoreWalletPage.restore')}
                </Button>
              </Col>
            </Row>
          </div>
        )}
      </footer>
    </div>
  );
};

const mapStateToProps = (state) => {
  const { wallet } = state;
  const { isWalletRestoring, isErrorRestoringWallet } = wallet;
  return {
    isWalletRestoring,
    isErrorRestoringWallet,
  };
};

const mapDispatchToProps = {
  restoreWallet: (mnemonicObj, history) =>
    restoreWalletRequest({ mnemonicObj, history }),
  resetRestoreWalletError: () => resetRestoreWalletError({}),
};

export default connect(mapStateToProps, mapDispatchToProps)(RestoreWallet);
