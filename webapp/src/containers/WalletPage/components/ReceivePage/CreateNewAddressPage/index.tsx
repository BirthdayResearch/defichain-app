import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import uid from 'uid';
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
} from 'reactstrap';
import { I18n } from 'react-redux-i18n';
import { MdArrowBack } from 'react-icons/md';
import { WALLET_RECEIVE_PATH } from '../../../../../constants';
import { addReceiveTxnsRequest } from '../../../reducer';
import { getNewAddress } from '../../../service';
import * as log from '../../../../../utils/electronLogger';

interface CreateNewAddressPageProps {
  addReceiveTxns: (data: any) => void;
  history: {
    push(url: string): void;
  };
}

const CreateNewAddressPage: React.FunctionComponent<CreateNewAddressPageProps> = (
  props: CreateNewAddressPageProps
) => {
  const [label, setLabel] = useState<string>('');
  const [addressTypeChecked, setAddressTypeChecked] = useState(false);

  const handleChange = (e) => {
    if (e.target.type === 'checkbox') {
      setAddressTypeChecked(!addressTypeChecked);
      return;
    }
    const { value } = e.target;
    if (value) {
      setLabel(value);
    } else {
      setLabel('');
    }
  };

  const onSubmit = async () => {
    try {
      const newAddress = await getNewAddress(label, addressTypeChecked);
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
          {I18n.t('containers.wallet.receivePage.createNewReceiveAddressLabel')}
        </title>
      </Helmet>
      <header className='header-bar'>
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
        <h1>
          {I18n.t('containers.wallet.receivePage.createNewReceiveAddressLabel')}
        </h1>
      </header>
      <div className='content'>
        <section>
          <Form>
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
            <Row>
              <Col md='4'>
                {I18n.t('containers.wallet.receivePage.addressType')}
              </Col>
              <Col md='8'>
                <FormGroup check>
                  <Label check className='switch'>
                    <Input
                      type='checkbox'
                      name='addressType'
                      id='addressType'
                      checked={addressTypeChecked}
                      onChange={handleChange}
                    />
                    &nbsp;
                    {I18n.t('containers.wallet.receivePage.legacyAddress')}
                  </Label>
                </FormGroup>
              </Col>
            </Row>
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
            <Button color='primary' onClick={onSubmit}>
              {I18n.t('containers.wallet.receivePage.createButton')}
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = {
  addReceiveTxns: (data: any) => addReceiveTxnsRequest(data),
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateNewAddressPage);
