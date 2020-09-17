import React from 'react';
import { Helmet } from 'react-helmet';
import { I18n } from 'react-redux-i18n';
import { NavLink } from 'react-router-dom';
import classnames from 'classnames';
import { MdArrowBack, MdCheck } from 'react-icons/md';
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

import Footer from './Footer';
import styles from './CreateDCT.module.scss';
import { TOKENS_PATH } from '../../../../../constants';
import { ITokenResponse } from '../../../../../utils/interfaces';

interface CreateDCTProps {
  handleChange: (e) => void;
  formState: any;
  collateralAddresses: any;
  IsCollateralAddressValid: boolean;
  isConfirmationModalOpen: string;
  setIsConfirmationModalOpen: (state: string) => void;
  createdTokenData: ITokenResponse;
  updatedTokenData: ITokenResponse;
  wait: number;
  setWait: (wait: number) => void;
  createConfirmation: () => void;
  updateConfirmation: () => void;
  handleDropDowns: (data: any, field: any, amount: any) => void;
  cancelConfirmation: () => void;
  isErrorCreatingToken: string;
  isErrorUpdatingToken: string;
  isUpdate: boolean;
}

const CreateDCT: React.FunctionComponent<CreateDCTProps> = (
  props: CreateDCTProps
) => {
  const {
    isUpdate,
    handleChange,
    formState,
    collateralAddresses,
    IsCollateralAddressValid,
    handleDropDowns,
    isConfirmationModalOpen,
    setIsConfirmationModalOpen,
    cancelConfirmation,
    createConfirmation,
    updateConfirmation,
    wait,
    createdTokenData,
    isErrorCreatingToken,
    updatedTokenData,
    isErrorUpdatingToken,
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
          {isUpdate
            ? I18n.t('containers.tokens.createToken.updateTitle')
            : I18n.t('containers.tokens.createToken.createTitle')}
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
                disabled={isUpdate}
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
                disabled={isUpdate}
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
      <Footer
        isUpdate={isUpdate}
        formState={formState}
        isConfirmationModalOpen={isConfirmationModalOpen}
        setIsConfirmationModalOpen={setIsConfirmationModalOpen}
        cancelConfirmation={cancelConfirmation}
        createConfirmation={createConfirmation}
        updateConfirmation={updateConfirmation}
        wait={wait}
        createdTokenData={createdTokenData}
        isErrorCreatingToken={isErrorCreatingToken}
        isErrorUpdatingToken={isErrorUpdatingToken}
        updatedTokenData={updatedTokenData}
      />
    </>
  );
};

export default CreateDCT;
