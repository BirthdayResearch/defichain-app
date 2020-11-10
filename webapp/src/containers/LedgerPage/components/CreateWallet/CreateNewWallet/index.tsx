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

import { WALLET_PAGE_PATH } from '../../../../../constants';
import styles from '../CreateWallet.module.scss';

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
        <title>{I18n.t('containers.wallet.createNewWalletPage.title')}</title>
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
            {I18n.t('containers.wallet.createNewWalletPage.back')}
          </span>
        </Button>
        <h1 className={classnames({ 'd-none': false })}>
          {I18n.t('containers.wallet.createNewWalletPage.createANewWallet')}
        </h1>
      </header>
      <div className='content'>
        <section>
          <p>
            {I18n.t('containers.wallet.createNewWalletPage.mnemonicGuideline')}
          </p>
          <Card className={styles.margin}>
            <CardBody>
              <Row>
                {Object.keys(mnemonicObj).map((key) => (
                  <Col md='4' sm='12' key={key}>
                    <Row>
                      <Col
                        className={`${styles.number} text-right`}
                        md='5'
                        lg='4'
                      >
                        {key}
                      </Col>
                      <Col className='text-left' md='7' lg='8'>
                        {mnemonicObj[key]}
                        <hr />
                      </Col>
                    </Row>
                  </Col>
                ))}
              </Row>
            </CardBody>
          </Card>
          <div className='text-center'>
            <Button color='link' size='sm' onClick={generateNewMnemonic}>
              <MdRefresh />
              <span className='d-md-inline'>
                {I18n.t('containers.wallet.createNewWalletPage.generateNewSet')}
              </span>
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
                color='link'
                className='mr-3'
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
