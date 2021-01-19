import React, { FormEvent, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { uid } from 'uid';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import {
  Button,
  Form,
  FormGroup,
  FormText,
  Label,
  Input,
  Row,
  Col,
  CustomInput,
} from 'reactstrap';
import { I18n } from 'react-redux-i18n';
import { MdArrowBack, MdArrowDropDown, MdArrowDropUp } from 'react-icons/md';
import { WALLET_RECEIVE_PATH } from '../../../../../constants';
import { addReceiveTxnsRequest } from '../../../reducer';
import { getNewAddress } from '../../../service';
import * as log from '../../../../../utils/electronLogger';
import Header from '../../../../HeaderComponent';
import styles from '../../../WalletPage.module.scss';
import {
  getPageTitle,
  isAddressMine,
  isValidAddress,
} from '../../../../../utils/utility';

export interface PaymentRequestModel {
  label: string;
  id: string;
  time: string;
  address: string;
  message?: string;
  amount?: number;
  unit?: string;
}

interface CreateNewAddressPageProps {
  paymentRequests: PaymentRequestModel[];
  addReceiveTxns: (data: any) => void;
  history: {
    push(url: string): void;
  };
}

enum AddressValidity {
  ERROR_EXIST_OWN_WALLET = 'containers.wallet.receivePage.existingAddress',
  ERROR_EXIST_OTHER_WALLET = 'containers.wallet.receivePage.existingAddressOthers',
  ERROR_INVALID_ADDRESS_FORMAT = 'containers.wallet.receivePage.invalidAddress',
}

const CreateNewAddressPage: React.FunctionComponent<CreateNewAddressPageProps> = (
  props: CreateNewAddressPageProps
) => {
  const [label, setLabel] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [addressTypeChecked, setAddressTypeChecked] = useState(false);
  const [
    automaticallyGenerateNewAddress,
    setAutomaticallyGenerateNewAddress,
  ] = useState(true);
  const [advanceOpen, setAdvanceOption] = useState(false);
  const [
    addressValidity,
    setAddressValidity,
  ] = useState<AddressValidity | null>();

  const handleChange = (e) => {
    if (e.target.type === 'checkbox') {
      setAutomaticallyGenerateNewAddress(!automaticallyGenerateNewAddress);
      return;
    }
    const { value } = e.target;
    if (value) {
      setLabel(value);
    } else {
      setLabel('');
    }
  };

  const handleChangeAddress = (e) => {
    const { value } = e.target;
    if (value) {
      isAddressValid(value);
      setAddress(value);
    } else {
      setAddress('');
    }
  };

  const isAddressAlreadyExists = (address) => {
    const paymentRequestObj = props.paymentRequests.find(
      (paymentRequest) => paymentRequest.address === address
    );
    return paymentRequestObj != null;
  };

  const isAddressValid = async (value) => {
    try {
      if (value.length < 26 || value.length > 35) {
        setAddressValidity(AddressValidity.ERROR_INVALID_ADDRESS_FORMAT);
        return;
      }
      if (!(await isValidAddress(value))) {
        setAddressValidity(AddressValidity.ERROR_INVALID_ADDRESS_FORMAT);
        return;
      }
      if (isAddressAlreadyExists(value)) {
        setAddressValidity(AddressValidity.ERROR_EXIST_OWN_WALLET);
        return;
      }
      if (!(await isAddressMine(value))) {
        setAddressValidity(AddressValidity.ERROR_EXIST_OTHER_WALLET);
        return;
      }
      setAddressValidity(null);
    } catch (error) {
      log.error(error);
    }
  };

  const onSubmit = async (event: FormEvent) => {
    try {
      event.preventDefault();
      let newAddress;
      if (address) {
        newAddress = address;
      } else {
        newAddress = await getNewAddress(label, addressTypeChecked);
      }
      if (!newAddress) {
        throw new Error(
          I18n.t('containers.wallet.receivePage.addressNotAvailable')
        );
      }
      const data = {
        label,
        id: uid(),
        time: new Date().toString(),
        address: newAddress,
        automaticallyGenerateNewAddress,
      };
      props.addReceiveTxns(data);
      props.history.push(WALLET_RECEIVE_PATH);
    } catch (err) {
      log.error(err);
    }
  };

  return (
    <div className='main-wrapper'>
      <Helmet>
        <title>
          {getPageTitle(
            I18n.t('containers.wallet.receivePage.createNewReceiveAddressLabel')
          )}
        </title>
      </Helmet>
      <Header>
        <Button
          to={WALLET_RECEIVE_PATH}
          tag={NavLink}
          color='link'
          className='header-bar-back'
        >
          <MdArrowBack />
          <span className='d-lg-inline text-uppercase'>
            {I18n.t('containers.wallet.receivePage.backButton')}
          </span>
        </Button>
        {!automaticallyGenerateNewAddress ? (
          <h1>{I18n.t('containers.wallet.receivePage.addReceiveAddress')}</h1>
        ) : (
          <h1>
            {I18n.t(
              'containers.wallet.receivePage.createNewReceiveAddressLabel'
            )}
          </h1>
        )}
      </Header>
      <div className='content'>
        <section>
          <Form onSubmit={onSubmit}>
            <FormGroup check className='mb-5'>
              <Label check className='switch'>
                <Input
                  type='checkbox'
                  name='automaticallyGenerateNewAddress'
                  id='automaticallyGenerateNewAddress'
                  checked={automaticallyGenerateNewAddress}
                  onChange={handleChange}
                />
                &nbsp;
                {I18n.t(
                  'containers.wallet.receivePage.automaticallyGenerateNewAddress'
                )}
              </Label>
            </FormGroup>
            {!automaticallyGenerateNewAddress && (
              <FormGroup className='form-label-group'>
                <Input
                  type='text'
                  value={address}
                  name='address'
                  id='address'
                  onChange={handleChangeAddress}
                  placeholder={I18n.t('containers.wallet.receivePage.address')}
                />
                {address ? (
                  <>
                    {addressValidity == null ? (
                      <FormText color='muted'>
                        {I18n.t('containers.wallet.receivePage.enterAnAddress')}
                      </FormText>
                    ) : (
                      <FormText className={styles['error-dialog']}>
                        {I18n.t(addressValidity)}
                      </FormText>
                    )}
                  </>
                ) : (
                  <FormText color='muted'>
                    {I18n.t('containers.wallet.receivePage.enterAnAddress')}
                  </FormText>
                )}
                <Label for='label'>
                  {I18n.t('containers.wallet.receivePage.address')}
                </Label>
              </FormGroup>
            )}
            <FormGroup className='form-label-group'>
              <Input
                type='text'
                value={label}
                name='label'
                id='label'
                onChange={handleChange}
                placeholder={I18n.t(
                  'containers.wallet.receivePage.addressLabel'
                )}
              />
              <FormText color='muted'>
                {I18n.t('containers.wallet.receivePage.createNewAddressNotice')}
              </FormText>
              <Label for='label'>
                {I18n.t('containers.wallet.receivePage.addressLabel')}
              </Label>
            </FormGroup>
            {automaticallyGenerateNewAddress && (
              <FormGroup
                className='d-flex'
                onClick={() => setAdvanceOption(!advanceOpen)}
              >
                <FormText color='muted'>
                  {I18n.t('containers.wallet.receivePage.showAdvanceOptions')}
                </FormText>
                <Button disabled={true} color='link' size='sm'>
                  {!advanceOpen ? <MdArrowDropDown /> : <MdArrowDropUp />}
                </Button>
              </FormGroup>
            )}
            {advanceOpen && (
              <Row>
                <Col md='4'>
                  <FormGroup>
                    <Label>
                      <strong>
                        {I18n.t('containers.wallet.receivePage.addressType')}
                      </strong>
                    </Label>
                  </FormGroup>
                </Col>
                <Col md='8' lg='6'>
                  <Row className='mb-5'>
                    <Col md='4'>
                      <FormGroup>
                        <CustomInput
                          type='radio'
                          name='addressType'
                          value={'false'}
                          id='addressType1'
                          label={I18n.t(
                            'containers.wallet.receivePage.default'
                          )}
                          checked={!addressTypeChecked}
                          onChange={() => setAddressTypeChecked(false)}
                        />
                      </FormGroup>
                    </Col>
                    <Col md='4'>
                      <FormGroup>
                        <CustomInput
                          type='radio'
                          name='addressType'
                          value={'true'}
                          id='addressType2'
                          label={I18n.t('containers.wallet.receivePage.legacy')}
                          checked={addressTypeChecked}
                          onChange={() => setAddressTypeChecked(true)}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </Col>
              </Row>
            )}
          </Form>
        </section>
      </div>
      <footer className='footer-bar'>
        <div className='d-flex justify-content-end'>
          <div>
            <Button
              to={WALLET_RECEIVE_PATH}
              tag={NavLink}
              color='link'
              className='mr-3'
            >
              {I18n.t('containers.wallet.receivePage.cancel')}
            </Button>
            <Button
              color='primary'
              onClick={onSubmit}
              disabled={
                !automaticallyGenerateNewAddress
                  ? addressValidity != null
                  : false
              }
            >
              {I18n.t('containers.wallet.receivePage.createButton')}
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

const mapStateToProps = (state) => {
  const { wallet } = state;

  return {
    paymentRequests: wallet.paymentRequests,
  };
};

const mapDispatchToProps = {
  addReceiveTxns: (data: any) => addReceiveTxnsRequest(data),
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateNewAddressPage);
