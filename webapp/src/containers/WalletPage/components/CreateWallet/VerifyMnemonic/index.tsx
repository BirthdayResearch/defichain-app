import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { I18n } from 'react-redux-i18n';
import { NavLink } from 'react-router-dom';
import classnames from 'classnames';
import { MdArrowBack, MdErrorOutline, MdWarning } from 'react-icons/md';
import {
  getRandomWordArray,
  selectNfromRange,
} from '../../../../../utils/utility';
import {
  VERIFY_MNEMONIC_QUIZ_OPTIONS_PER_QUESTIONS_LIMIT,
  VERIFY_MNEMONIC_QUIZ_QUESTIONS_LIMIT,
  WALLET_CREATE_PATH,
  WALLET_TOKENS_PATH,
} from '../../../../../constants';
import { Row, Col, Button } from 'reactstrap';

import styles from '../CreateWallet.module.scss';
import { createWalletRequest, resetCreateWalletError } from '../../../reducer';
import { connect } from 'react-redux';
import WalletLoadingFooter from '../../../../../components/WalletLoadingFooter';
import Header from '../../../../HeaderComponent';
import shuffle from 'lodash/shuffle';

interface VerifyMnemonicProps {
  mnemonicObj: any;
  finalMixObj: any;
  mnemonicCode: string;
  isWalletTabActive: boolean;
  isWalletCreating: boolean;
  isErrorCreatingWallet: string;
  history: any;
  setIsWalletTabActive: (isWalletTabActive: boolean) => void;
  createWallet: (mnemonicCode: string, history: any) => void;
  resetCreateWalletError: () => void;
}

const VerifyMnemonic: React.FunctionComponent<VerifyMnemonicProps> = (
  props: VerifyMnemonicProps
) => {
  const [quiz, setQuiz] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>({});
  const [enableSubmit, setEnableSubmit] = useState(false);
  const [showSkipVerification, setShowSkipVerification] = useState(false);

  const {
    isWalletTabActive,
    setIsWalletTabActive,
    mnemonicObj,
    history,
    isWalletCreating,
    isErrorCreatingWallet,
    mnemonicCode,
    createWallet,
    resetCreateWalletError,
  } = props;

  const handleClick = (wordNum, option) => {
    const clone = Object.assign({}, selected);
    if (!clone[wordNum]) {
      clone[wordNum] = option;
    } else {
      if (clone[wordNum] === option) {
        clone[wordNum] = '';
      } else {
        clone[wordNum] = option;
      }
    }
    setSelected(clone);
  };

  useEffect(() => {
    props.resetCreateWalletError();
    createWalletRecoveryQuiz();
  }, []);

  useEffect(() => {
    quizValidator();
  }, [selected]);

  const quizValidator = () => {
    const selectedKeys = Object.keys(selected).map((item) => !!selected[item]);
    if (selectedKeys.length === 6) {
      const isValidated = quiz.reduce(
        (acc, item) => acc && selected[item.wordNum] === item.correct
      );
      if (isValidated) {
        return setEnableSubmit(true);
      }
    }
    return setEnableSubmit(false);
  };

  const createWalletRecoveryQuiz = () => {
    const lowerBound = 1;
    const upperBound = Object.keys(mnemonicObj).length;
    const limit = VERIFY_MNEMONIC_QUIZ_QUESTIONS_LIMIT;
    const optionsPerQuestions = VERIFY_MNEMONIC_QUIZ_OPTIONS_PER_QUESTIONS_LIMIT;
    const distinctQnum = selectNfromRange(
      lowerBound,
      upperBound,
      limit
    ).sort((a, b) => (a > b ? 1 : -1));
    const randomOptionsWords = getRandomWordArray();
    const updatedData = distinctQnum.map((item, id) => ({
      wordNum: item,
      options: shuffle(
        [mnemonicObj[item]].concat(
          randomOptionsWords.slice(
            id * (optionsPerQuestions - 1),
            (id + 1) * (optionsPerQuestions - 1)
          )
        )
      ),
      correct: mnemonicObj[item],
    }));
    setQuiz(updatedData);
  };
  return (
    <>
      <Helmet>
        <title>{I18n.t('containers.wallet.verifyMnemonicPage.title')}</title>
      </Helmet>
      <Header>
        <Button
          to={WALLET_CREATE_PATH}
          tag={NavLink}
          color='link'
          className='header-bar-back'
        >
          <MdArrowBack />
          <span className='d-lg-inline'>
            {I18n.t('containers.wallet.verifyMnemonicPage.back')}
          </span>
        </Button>
        <h1 className={classnames({ 'd-none': false })}>
          {I18n.t('containers.wallet.verifyMnemonicPage.verifyMnemonicSeed')}
        </h1>
      </Header>
      <div className='content'>
        <section>
          <p>
            {I18n.t(
              'containers.wallet.verifyMnemonicPage.verifyMnemonicGuideline'
            )}
          </p>
          <div className={styles.verifyHeadLine6}>
            {I18n.t(
              'containers.wallet.verifyMnemonicPage.verifyMnemonicWhichOne'
            )}
          </div>
          <Row>
            {quiz.map((item, id) => (
              <Col
                key={item.wordNum + '_' + id}
                xs='12'
                md='6'
                className='my-3'
              >
                <h5>
                  {I18n.t('containers.wallet.verifyMnemonicPage.wordQuestion', {
                    wordNum: item.wordNum,
                  })}
                </h5>
                <Row>
                  <Col xs='12'>
                    {item.options.map((word) => (
                      <span key={item.wordNum + '_' + word} className='mr-3'>
                        <Button
                          color={
                            word === selected[item.wordNum]
                              ? 'primary'
                              : 'outline-primary'
                          }
                          className={styles.optionText}
                          onClick={() => handleClick(item.wordNum, word)}
                        >
                          {word}
                        </Button>
                      </span>
                    ))}
                  </Col>
                </Row>
              </Col>
            ))}
          </Row>
        </section>
      </div>
      <footer className='footer-bar'>
        {isWalletCreating ? (
          <WalletLoadingFooter
            message={I18n.t(
              'containers.wallet.verifyMnemonicPage.creatingYourWallet'
            )}
          />
        ) : isErrorCreatingWallet.length !== 0 ? (
          <>
            <div className={`footer-sheet`}>
              <div className='text-center'>
                <MdErrorOutline
                  className={classnames({
                    'footer-sheet-icon': true,
                    [styles[`error-dialog`]]: true,
                  })}
                />
                <p>{isErrorCreatingWallet}</p>
              </div>
            </div>
            <div className='d-flex align-items-center justify-content-center'>
              <Button
                color='primary'
                onClick={() => {
                  resetCreateWalletError();
                  history.push(WALLET_TOKENS_PATH);
                }}
              >
                {I18n.t(
                  'containers.wallet.verifyMnemonicPage.backToWalletPage'
                )}
              </Button>
            </div>
          </>
        ) : (
          <div>
            {showSkipVerification && (
              <div className={`footer-sheet`}>
                <div className='text-center'>
                  <MdWarning
                    className={classnames({
                      'footer-sheet-icon': true,
                      [styles[`warning-dailog`]]: true,
                    })}
                  />
                  <h3>
                    {I18n.t(
                      'containers.wallet.verifyMnemonicPage.skipVerificationTextHeader'
                    )}
                  </h3>
                  <p>
                    {I18n.t(
                      'containers.wallet.verifyMnemonicPage.skipVerificationText'
                    )}
                  </p>
                </div>
              </div>
            )}
            <Row className='justify-content-between align-items-center'>
              <Col>
                {!showSkipVerification && (
                  <Button
                    color='link'
                    size='sm'
                    className='footer-bar-back'
                    onClick={() => {
                      setIsWalletTabActive(!isWalletTabActive);
                    }}
                  >
                    <MdArrowBack />
                    <span className='d-md-inline'>
                      {I18n.t('containers.wallet.verifyMnemonicPage.showAgain')}
                    </span>
                  </Button>
                )}
              </Col>
              <Col className='d-flex justify-content-end'>
                {/* <Button
                  color='link'
                  onClick={() =>
                    setShowSkipVerification(!showSkipVerification)
                  }
                >
                  {showSkipVerification
                    ? I18n.t('containers.wallet.verifyMnemonicPage.dontSkip')
                    : I18n.t('containers.wallet.verifyMnemonicPage.skip')}
                </Button> */}
                <Button
                  color={showSkipVerification ? 'primary' : 'primary'}
                  disabled={!(showSkipVerification || enableSubmit)}
                  onClick={() => createWallet(mnemonicCode, history)}
                >
                  {showSkipVerification
                    ? I18n.t('containers.wallet.verifyMnemonicPage.skip')
                    : I18n.t('containers.wallet.verifyMnemonicPage.continue')}
                </Button>
              </Col>
            </Row>
          </div>
        )}
      </footer>
    </>
  );
};

const mapStateToProps = (state) => {
  const { wallet } = state;
  const { isWalletCreating, isErrorCreatingWallet } = wallet;
  return {
    isWalletCreating,
    isErrorCreatingWallet,
  };
};

const mapDispatchToProps = {
  createWallet: (mnemonicCode, history) =>
    createWalletRequest({ mnemonicCode, history }),
  resetCreateWalletError: () => resetCreateWalletError({}),
};

export default connect(mapStateToProps, mapDispatchToProps)(VerifyMnemonic);
