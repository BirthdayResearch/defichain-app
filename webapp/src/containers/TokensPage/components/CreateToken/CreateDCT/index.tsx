import React from 'react';
import { Helmet } from 'react-helmet';
import { I18n } from 'react-redux-i18n';
import { NavLink } from 'react-router-dom';
import classnames from 'classnames';
import { MdArrowBack, MdCheck } from 'react-icons/md';
import {
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
  Row,
  Col,
} from 'reactstrap';

import Footer from './Footer';
import styles from './CreateDCT.module.scss';
import { TOKENS_PATH } from '../../../../../constants';
import { ITokenResponse } from '../../../../../utils/interfaces';
import Header from '../../../../HeaderComponent';
import {
  getPageTitle,
  getTransactionAddressLabel,
} from '../../../../../utils/utility';
import AddressDropdown from '../../../../../components/AddressDropdown';
import { CreateTokenFormState } from '..';

interface CreateDCTProps {
  handleChange: (e) => void;
  formState: CreateTokenFormState;
  IsCollateralAddressValid: boolean;
  isConfirmationModalOpen: string;
  setIsConfirmationModalOpen: (state: string) => void;
  createdTokenData: ITokenResponse;
  updatedTokenData: ITokenResponse;
  wait: number;
  setWait: (wait: number) => void;
  createConfirmation: () => void;
  updateConfirmation: () => void;
  handleDropDowns: (newData: any, amount: any) => void;
  cancelConfirmation: () => void;
  isErrorCreatingToken: string;
  isErrorUpdatingToken: string;
  isUpdate: boolean;
}

const getTransactionLabel = (formState: CreateTokenFormState) => {
  return getTransactionAddressLabel(
    formState.receiveLabel,
    formState.receiveAddress,
    I18n.t('containers.tokens.createToken.collateralAddress')
  );
};

const CreateDCT: React.FunctionComponent<CreateDCTProps> = (
  props: CreateDCTProps
) => {
  const {
    isUpdate,
    handleChange,
    formState,
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
        <title>
          {getPageTitle(I18n.t('containers.tokens.tokensPage.title'))}
        </title>
      </Helmet>
      <Header>
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
      </Header>
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
            {/* NOTE: Do not remove, for future purpose */}
            {/* <FormGroup className='form-label-group'>
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
            <FormGroup row>
              <Label sm={4} for='mintable'>
                <strong>
                  {I18n.t('containers.tokens.createToken.mintingSupport')}
                </strong>
              </Label>
              <Col sm={{ size: 8 }}>
                <FormGroup row>
                  <Col md='2'>
                    <FormGroup>
                      <CustomInput
                        type='radio'
                        name='mintable'
                        value={'false'}
                        id='mintable'
                        label={I18n.t('containers.tokens.createToken.no')}
                        checked={formState.mintable === 'false'}
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup>
                      <CustomInput
                        type='radio'
                        name='mintable'
                        value={'true'}
                        id='mintable2'
                        label={I18n.t('containers.tokens.createToken.yes')}
                        checked={formState.mintable === 'true'}
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </Col>
                </FormGroup>
              </Col>
            </FormGroup>
            <FormText className='mb-5'>
              {I18n.t('containers.tokens.createToken.mintText')}
            </FormText>
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
                    <FormGroup>
                      <CustomInput
                        type='radio'
                        name='tradeable'
                        value={'false'}
                        id='tradeable1'
                        label={I18n.t('containers.tokens.createToken.no')}
                        checked={formState.tradeable === 'false'}
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup>
                      <CustomInput
                        type='radio'
                        name='tradeable'
                        value={'true'}
                        id='tradeable2'
                        label={I18n.t('containers.tokens.createToken.yes')}
                        checked={formState.tradeable === 'true'}
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </Col>
            </Row> */}
            <AddressDropdown
              formState={formState}
              getTransactionLabel={getTransactionLabel}
              onSelectAddress={handleDropDowns}
              additionalClass={() =>
                !IsCollateralAddressValid ? styles.collateralDropdown : ''
              }
              isDisabled={isUpdate}
            />
            {!IsCollateralAddressValid && (
              <FormText className={`${styles.collateralFormText} mt-2`}>
                {I18n.t('containers.tokens.createToken.collateralAddressError')}
              </FormText>
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
        IsCollateralAddressValid={IsCollateralAddressValid}
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
