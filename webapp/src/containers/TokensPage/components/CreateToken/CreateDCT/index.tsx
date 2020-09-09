import React from 'react';
import { Helmet } from 'react-helmet';
import { I18n } from 'react-redux-i18n';
import { NavLink } from 'react-router-dom';
import classnames from 'classnames';
import {
  MdArrowBack,
  MdCheck,
  MdCheckCircle,
  MdErrorOutline,
} from 'react-icons/md';
import {
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

import styles from './CreateDCT.module.scss';
import {
  TOKENS_PATH,
  MINIMUM_DFI_REQUIRED_FOR_TOKEN_CREATION,
} from '../../../../../constants';

interface CreateDCTProps {
  handleChange: (e) => void;
  formState: any;
  collateralAddresses: any;
  IsCollateralAddressValid: boolean;
  isConfirmationModalOpen: string;
  setIsConfirmationModalOpen: any;
  createdTokenData: any;
  wait: number;
  setWait: any;
  confirmation: () => void;
  handleDropDowns: (data: any, field: any, amount: any) => void;
  cancelConfirmation: () => void;
  isErrorCreatingToken: any;
}

const CreateDCT: React.FunctionComponent<CreateDCTProps> = (
  props: CreateDCTProps
) => {
  const {
    handleChange,
    formState,
    collateralAddresses,
    IsCollateralAddressValid,
    handleDropDowns,
    isConfirmationModalOpen,
    setIsConfirmationModalOpen,
    cancelConfirmation,
    confirmation,
    wait,
    createdTokenData,
    isErrorCreatingToken,
  } = props;

  return (
    <>
      <Helmet>
        <title>{I18n.t('containers.tokens.tokensPage.title')}</title>
      </Helmet>
      <header className='header-bar'>
        <Button
          to={TOKENS_PATH}
          tag={NavLink}
          color='link'
          className='header-bar-back'
        >
          <MdArrowBack />
          <span className='d-lg-inline'>
            {I18n.t('containers.tokens.createToken.back')}
          </span>
        </Button>
        <h1 className={classnames({ 'd-none': false })}>
          {I18n.t('containers.tokens.createToken.title')}
        </h1>
      </header>
      <div className='content'>
        <section>
          <Form>
            <FormGroup className='form-label-group'>
              <Input
                type='text'
                placeholder={I18n.t('containers.tokens.createToken.name')}
                name='name'
                id='name'
                value={formState.name}
                onChange={handleChange}
                valid={formState.name.length > 0}
                invalid={formState.name.length > 128}
              />
              <Label for='message'>
                {I18n.t('containers.tokens.createToken.name')}
              </Label>
            </FormGroup>
            <FormGroup className='form-label-group'>
              <Input
                type='text'
                placeholder={I18n.t('containers.tokens.createToken.symbol')}
                name='symbol'
                id='symbol'
                value={formState.symbol}
                onChange={handleChange}
                required
                valid={formState.symbol.length > 0}
                invalid={formState.symbol.length > 8}
              />
              <Label for='message'>
                {I18n.t('containers.tokens.createToken.symbol')}
              </Label>
            </FormGroup>
            <FormGroup className='form-label-group'>
              <Input
                type='number'
                inputMode='numeric'
                placeholder={I18n.t('containers.tokens.createToken.decimal')}
                name='decimal'
                id='decimal'
                value={formState.decimal}
                onChange={handleChange}
              />
              <Label for='message'>
                {I18n.t('containers.tokens.createToken.decimal')}
              </Label>
              {/* <UncontrolledDropdown
                className="w-100">
                <DropdownToggle caret color='outline-secondary' className={styles.divisibilityDropdown}>
                  {I18n.t('containers.tokens.createToken.divisibility')}
                </DropdownToggle>
                <DropdownMenu>
                  {divisibilityData.map((decimal) => {
                    return (
                      <DropdownItem
                        className='d-flex justify-content-between ml-0'
                        key={decimal.value}
                        name='divisibility'
                        onClick={handleChange}
                        value={decimal.value}
                      >
                        <span>{I18n.t(decimal.label)}</span>
                        &nbsp;
                        {formState.divisibility === decimal.value && (
                          <MdCheck />
                        )}
                      </DropdownItem>
                    );
                  })}
                </DropdownMenu>
              </UncontrolledDropdown> */}
              <FormText className='mt-2'>
                {I18n.t('containers.tokens.createToken.decimalText')}
              </FormText>
            </FormGroup>
            <FormGroup className='form-label-group'>
              <Input
                type='number'
                inputMode='numeric'
                placeholder={I18n.t('containers.tokens.createToken.limit')}
                name='limit'
                id='limit'
                value={formState.limit}
                onChange={handleChange}
              />
              <Label for='message'>
                {I18n.t('containers.tokens.createToken.limit')}
              </Label>
            </FormGroup>
            <Row>
              <Col md='4'>
                <FormGroup>
                  <Label>
                    <strong>
                      {I18n.t('containers.tokens.createToken.mintingSupport')}
                    </strong>
                  </Label>
                </FormGroup>
              </Col>
              <Col md='8' lg='6'>
                <Row className='mb-5'>
                  <Col md='2'>
                    <FormGroup check onChange={handleChange}>
                      <Label check>
                        <Input
                          type='radio'
                          name='mintable'
                          value={'false'}
                          checked={formState.mintable === 'false'}
                        />{' '}
                        <strong>
                          {I18n.t('containers.tokens.createToken.no')}
                        </strong>
                      </Label>
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup check onChange={handleChange}>
                      <Label check>
                        <Input
                          type='radio'
                          name='mintable'
                          value='true'
                          checked={formState.mintable === 'true'}
                        />{' '}
                        <strong>
                          {I18n.t('containers.tokens.createToken.yes')}
                        </strong>
                      </Label>
                    </FormGroup>
                  </Col>
                </Row>
              </Col>
            </Row>
            {/* <FormGroup className='form-label-group'>
              <Input
                type='number'
                inputMode='numeric'
                placeholder={I18n.t(
                  'containers.tokens.createToken.optionalFinalSupplyLimit'
                )}
                name='optionalFinalSupplyLimit'
                id='optionalFinalSupplyLimit'
                value={formState.optionalFinalSupplyLimit}
                onChange={handleChange}
              />
              <Label for='message'>
                {I18n.t(
                  'containers.tokens.createToken.optionalFinalSupplyLimit'
                )}
              </Label>
              <FormText>
                {I18n.t(
                  'containers.tokens.createToken.optionalFinalSupplyLimitText'
                )}
              </FormText>
            </FormGroup> */}
            <Row>
              <Col md='4'>
                <FormGroup>
                  <Label>
                    <strong>
                      {I18n.t('containers.tokens.createToken.tradeable')}
                    </strong>
                  </Label>
                </FormGroup>
              </Col>
              <Col md='8' lg='6'>
                <Row className='mb-5'>
                  <Col md='2'>
                    <FormGroup check onChange={handleChange}>
                      <Label check>
                        <Input
                          type='radio'
                          name='tradeable'
                          value='false'
                          checked={formState.tradeable === 'false'}
                        />{' '}
                        <strong>
                          {I18n.t('containers.tokens.createToken.no')}
                        </strong>
                      </Label>
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup check onChange={handleChange}>
                      <Label check>
                        <Input
                          type='radio'
                          name='tradeable'
                          value='true'
                          checked={formState.tradeable === 'true'}
                        />{' '}
                        <strong>
                          {I18n.t('containers.tokens.createToken.yes')}
                        </strong>
                      </Label>
                    </FormGroup>
                  </Col>
                </Row>
              </Col>
            </Row>
            <UncontrolledDropdown className='w-100'>
              <DropdownToggle
                caret
                color='outline-secondary'
                className={`${styles.divisibilityDropdown}
                ${!IsCollateralAddressValid ? styles.collateralDropdown : ''}`}
              >
                {I18n.t('containers.tokens.createToken.collateralAddress')}
              </DropdownToggle>
              <DropdownMenu>
                {collateralAddresses.map((data) => {
                  return (
                    <DropdownItem
                      className='d-flex justify-content-between ml-0'
                      key={data.address}
                      name='collateralAddress'
                      onClick={() =>
                        handleDropDowns(
                          data.address,
                          'collateralAddress',
                          data.amount
                        )
                      }
                      value={data.address}
                    >
                      <span>{I18n.t(data.address)}</span>
                      &nbsp;
                      {formState.collateralAddress === data.address && (
                        <MdCheck />
                      )}
                    </DropdownItem>
                  );
                })}
              </DropdownMenu>
            </UncontrolledDropdown>
            {!IsCollateralAddressValid ? (
              <FormText className={`${styles.collateralFormText} mt-2`}>
                {I18n.t('containers.tokens.createToken.collateralAddressError')}
              </FormText>
            ) : (
              ''
            )}
          </Form>
        </section>
      </div>
      <footer className='footer-bar'>
        <div
          className={classnames({
            'd-none': isConfirmationModalOpen !== 'default',
          })}
        >
          <Row className='justify-content-between align-items-center'>
            <Col className='col-auto'>
              <div className='caption-secondary'>
                {I18n.t('containers.tokens.createToken.dfiRequired')}
              </div>
              <div>
                {MINIMUM_DFI_REQUIRED_FOR_TOKEN_CREATION}
                &nbsp;
                {'DFI'}
              </div>
            </Col>
            <Col className='d-flex justify-content-end'>
              <Button
                to={TOKENS_PATH}
                tag={NavLink}
                color='link'
                className='mr-3'
              >
                {I18n.t('containers.tokens.createToken.cancel')}
              </Button>
              <Button
                disabled={
                  !formState.symbol ||
                  !formState.collateralAddress ||
                  formState.symbol.length > 8 ||
                  formState.name.length > 128
                }
                onClick={() => {
                  setIsConfirmationModalOpen('confirm');
                }}
                color='primary'
              >
                {I18n.t('containers.tokens.createToken.createTokenButton')}
              </Button>
            </Col>
          </Row>
        </div>
        <div
          className={classnames({
            'd-none': isConfirmationModalOpen !== 'confirm',
          })}
        >
          <div className='footer-sheet'>
            <dl className='row'>
              <dd className='col-12'>
                <span className='h2 mb-0'>
                  {I18n.t('containers.tokens.createToken.confirmationText')}
                </span>
              </dd>
            </dl>
          </div>
          <Row className='justify-content-between align-items-center'>
            <Col className='d-flex justify-content-end'>
              <Button
                color='link'
                className='mr-3'
                onClick={() => cancelConfirmation()}
              >
                {I18n.t('containers.masterNodes.createMasterNode.noButtonText')}
              </Button>
              <Button
                color='primary'
                onClick={() => confirmation()}
                disabled={wait > 0 ? true : false}
              >
                {I18n.t(
                  'containers.masterNodes.createMasterNode.yesButtonText'
                )}
                &nbsp;
                <span className='timer'>{wait > 0 ? wait : ''}</span>
              </Button>
            </Col>
          </Row>
        </div>
        <div
          className={classnames({
            'd-none': isConfirmationModalOpen !== 'success',
          })}
        >
          <div className='footer-sheet'>
            <div className='text-center'>
              <p>{I18n.t('containers.tokens.createToken.tokenSuccess')}</p>
              <MdCheckCircle className='footer-sheet-icon' />
              <p>
                {`${I18n.t('containers.tokens.createToken.tokenHash')}: ${
                  createdTokenData.hash
                }`}
              </p>
            </div>
          </div>
          <Row className='justify-content-between align-items-center'>
            <Col className='d-flex justify-content-end'>
              <Button color='primary' to={TOKENS_PATH} tag={NavLink}>
                {I18n.t('containers.tokens.createToken.backToTokenPage')}
              </Button>
            </Col>
          </Row>
        </div>
        <div
          className={classnames({
            'd-none': isConfirmationModalOpen !== 'failure',
          })}
        >
          <div className='footer-sheet'>
            <div className='text-center'>
              <MdErrorOutline
                className={classnames({
                  'footer-sheet-icon': true,
                  [styles[`error-dailog`]]: true,
                })}
              />
              <p>{isErrorCreatingToken}</p>
            </div>
          </div>
          <div className='d-flex align-items-center justify-content-center'>
            <Button color='primary' to={TOKENS_PATH} tag={NavLink}>
              {I18n.t('containers.tokens.createToken.backToTokenPage')}
            </Button>
          </div>
        </div>
      </footer>
    </>
  );
};

export default CreateDCT;
