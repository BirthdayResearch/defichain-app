import React, { FormEvent, useState } from 'react';
import { NavLink } from 'react-router-dom';
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
import * as log from '../../utils/electronLogger';
import Header from '@/containers/HeaderComponent';

interface CreateNewAddressProps {
  history: {
    push(url: string): void;
  };
  receivePath: string;
  handleSubmit: (label: string, addressTypeChecked: boolean) => void;
}

const CreateNewAddress: React.FunctionComponent<CreateNewAddressProps> = (
  props: CreateNewAddressProps
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

  const onSubmit = async (event: FormEvent) => {
    try {
      event.preventDefault();
      props.handleSubmit(label, addressTypeChecked);
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
      <Header>
        <Button
          to={props.receivePath}
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
      </Header>
      <div className='content'>
        <section>
          <Form onSubmit={onSubmit}>
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
              to={props.receivePath}
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

export default CreateNewAddress;
