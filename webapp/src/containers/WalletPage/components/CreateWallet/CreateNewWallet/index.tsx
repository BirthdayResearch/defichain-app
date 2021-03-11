import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { I18n } from 'react-redux-i18n';
import { NavLink } from 'react-router-dom';
import classnames from 'classnames';
import { MdArrowBack, MdRefresh } from 'react-icons/md';
import {
  Row,
  Col,
  Button,
  FormGroup,
  Label,
  Input,
  Card,
  CardBody,
} from 'reactstrap';

import {
  LEARN_MORE_ABOUT_BITCOIN_LINK,
  WALLET_TOKENS_PATH,
} from '../../../../../constants';
import styles from '../CreateWallet.module.scss';
import Header from '../../../../HeaderComponent';
import openNewTab from '../../../../../utils/openNewTab';
import { getPageTitle } from '../../../../../utils/utility';

interface CreateNewWalletProps {
  mnemonicObj: any;
  isWalletTabActive: boolean;
  generateNewMnemonic: () => void;
  setIsWalletTabActive: (isWalletTabActive: boolean) => void;
}

const CreateNewWallet: React.FunctionComponent<CreateNewWalletProps> = (
  props: CreateNewWalletProps
) => {
  const {
    mnemonicObj,
    generateNewMnemonic,
    isWalletTabActive,
    setIsWalletTabActive,
  } = props;

  const [isChecked, setIsChecked] = useState(false);

  return (
    <>
      <Helmet>
        <title>
          {getPageTitle(I18n.t('containers.wallet.createNewWalletPage.title'))}
        </title>
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
          {I18n.t('containers.wallet.createNewWalletPage.createANewWallet')}
        </h1>
      </Header>
      <div className='content'>
        <section>
          <p>
            {I18n.t('containers.wallet.createNewWalletPage.mnemonicGuideline')}
          </p>
          <p className={styles.mnemonicGuidelineWarning}>
            {I18n.t(
              'containers.wallet.createNewWalletPage.mnemonicGuidelineWarning'
            )}
          </p>
          <Card className={styles.margin}>
            <CardBody>
              <Row className={styles.seeds}>
                {Object.keys(mnemonicObj).map((key) => (
                  <Col md='4' xs='12' key={key}>
                    <Row>
                      <Col
                        className={`${styles.number} text-right pl-0`}
                        xs='2'
                      >
                        {key}
                      </Col>
                      <Col className='text-left pl-0' xs='10'>
                        {mnemonicObj[key]}
                        <hr />
                      </Col>
                    </Row>
                  </Col>
                ))}
              </Row>
            </CardBody>
          </Card>
          <div className='text-center mt-4'>
            <Button color='link' size='sm' onClick={generateNewMnemonic}>
              <MdRefresh />
              <span className='d-md-inline'>
                {I18n.t('containers.wallet.createNewWalletPage.generateNewSet')}
              </span>
            </Button>
          </div>
          <div className={styles.walletRecoveryInfo}>
            <p>
              {I18n.t(
                'containers.wallet.createNewWalletPage.walletRecoveryInfoLine1'
              )}
            </p>
            <p>
              {I18n.t(
                'containers.wallet.createNewWalletPage.walletRecoveryInfoLine2'
              )}
            </p>
            <Button
              color='link'
              className='p-0'
              onClick={() => openNewTab(LEARN_MORE_ABOUT_BITCOIN_LINK)}
            >
              {I18n.t(
                'containers.wallet.createNewWalletPage.learnMoreAtBitcoinBtn'
              )}
            </Button>
          </div>
        </section>
      </div>
      <footer className='footer-bar'>
        <div>
          <Row className='justify-content-between align-items-center'>
            <Col className='col-auto'>
              <FormGroup check>
                <Label check>
                  <Input
                    type='checkbox'
                    onClick={() => setIsChecked(!isChecked)}
                  />
                  &nbsp;
                  {I18n.t(
                    'containers.wallet.createNewWalletPage.copied24Words'
                  )}
                </Label>
              </FormGroup>
            </Col>
            <Col className='d-flex justify-content-end'>
              <Button
                color='primary'
                disabled={!isChecked}
                onClick={() => {
                  setIsWalletTabActive(!isWalletTabActive);
                }}
              >
                {I18n.t('containers.wallet.createNewWalletPage.continue')}
              </Button>
            </Col>
          </Row>
        </div>
      </footer>
    </>
  );
};

export default CreateNewWallet;
