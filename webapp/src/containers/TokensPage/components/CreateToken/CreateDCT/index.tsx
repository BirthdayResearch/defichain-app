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

import { TOKENS_PATH, DCT_DISTRIBUTION } from '../../../../../constants';

interface CreateDCTProps {
  handleActiveTab: (active: string) => void;
  handleChange: (e) => void;
  formState: any;
}

const CreateDCT: React.FunctionComponent<CreateDCTProps> = (
  props: CreateDCTProps
) => {
  const divisibilityData = [
    { label: '8', value: '8' },
    { label: '9', value: '9' },
    { label: '10', value: '10' },
    { label: '11', value: '11' },
    { label: '12', value: '12' },
  ];

  const { handleActiveTab, handleChange, formState } = props;

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
                placeholder={I18n.t('containers.tokens.createToken.nameLabel')}
                name='nameLabel'
                id='nameLabel'
                value={formState.nameLabel}
                onChange={handleChange}
              />
              <Label for='message'>
                {I18n.t('containers.tokens.createToken.nameLabel')}
              </Label>
            </FormGroup>
            <FormGroup className='form-label-group'>
              <Input
                type='text'
                placeholder={I18n.t(
                  'containers.tokens.createToken.tickerSymbol'
                )}
                name='tickerSymbol'
                id='tickerSymbol'
                value={formState.tickerSymbol}
                onChange={handleChange}
              />
              <Label for='message'>
                {I18n.t('containers.tokens.createToken.tickerSymbol')}
              </Label>
            </FormGroup>
            <FormGroup className='form-label-group'>
              <UncontrolledDropdown>
                <DropdownToggle caret color='outline-secondary'>
                  {I18n.t('containers.tokens.createToken.divisibility')}
                </DropdownToggle>
                <DropdownMenu>
                  {divisibilityData.map((decimal) => {
                    return (
                      <DropdownItem
                        className='d-flex justify-content-between'
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
              </UncontrolledDropdown>
              <FormText className='mt-2'>
                {I18n.t('containers.tokens.createToken.divisibilityText')}
              </FormText>
            </FormGroup>
            <FormGroup className='form-label-group'>
              <Input
                type='text'
                placeholder={I18n.t(
                  'containers.tokens.createToken.initialSupply'
                )}
                name='initialSupply'
                id='initialSupply'
                value={formState.initialSupply}
                onChange={handleChange}
              />
              <Label for='message'>
                {I18n.t('containers.tokens.createToken.initialSupply')}
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
                          name='mintingSupport'
                          value='no'
                          checked={formState.mintingSupport === 'no'}
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
                          name='mintingSupport'
                          value='yes'
                          checked={formState.mintingSupport === 'yes'}
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
            <FormGroup className='form-label-group'>
              <Input
                type='text'
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
            </FormGroup>
            <Row>
              <Col md='4'>
                <FormGroup>
                  <Label>
                    <strong>
                      {I18n.t('containers.tokens.createToken.tradable')}
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
                          name='tradable'
                          value='no'
                          checked={formState.tradable === 'no'}
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
                          name='tradable'
                          value='yes'
                          checked={formState.tradable === 'yes'}
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
          </Form>
        </section>
      </div>
      <footer className='footer-bar'>
        <div>
          <Row className='justify-content-between align-items-center'>
            <Col className='col-auto'>
              <div className='caption-secondary'>
                {I18n.t('containers.tokens.createToken.dfiRequired')}
              </div>
              <div>
                {'1,000'}
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
                  !formState.nameLabel ||
                  !formState.tickerSymbol ||
                  !formState.initialSupply
                }
                onClick={() => handleActiveTab(DCT_DISTRIBUTION)}
                color='primary'
              >
                {I18n.t('containers.tokens.createToken.continue')}
              </Button>
            </Col>
          </Row>
        </div>
      </footer>
    </>
  );
};

export default CreateDCT;
