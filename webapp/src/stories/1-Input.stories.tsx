import React from 'react';
import '../app/App.scss';
import {
  Button,
  Row,
  Col,
  FormGroup,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  Input,
} from 'reactstrap';
import RangeSlider from 'react-bootstrap-range-slider';

export default {
  title: 'Input',
};

export const Textfields = () => (
  <div className='container mt-5'>
    <h2>Default</h2>
    <FormGroup className='form-label-group'>
      <Input type='text' placeholder='Name' name='name' id='name' />
      <Label for='name'>Name</Label>
    </FormGroup>
    <FormGroup className='form-label-group'>
      <Input
        type='textarea'
        name='message'
        id='message'
        placeholder='Message'
        rows='3'
      />
      <Label for='message'>Message</Label>
    </FormGroup>

    <h2>InputGroup</h2>
    <FormGroup className='form-label-group'>
      <InputGroup>
        <Input
          type='text'
          inputMode='numeric'
          placeholder='Amount to Receive'
          name='amountToReceive'
          id='amountToReceive'
        />
        <Label for='amountToReceive'>Amount to receive</Label>
        <InputGroupAddon addonType='append'>
          <InputGroupText>DFI</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </FormGroup>

    <h2>Grid</h2>
    <FormGroup className='form-label-group form-row'>
      <Col>
        <InputGroup>
          <Input
            type='text'
            inputMode='numeric'
            placeholder='Amount to Send'
            name='amountToSend'
            id='amountToSend'
          />
          <Label for='amountToSend'>Amount to send</Label>
          <InputGroupAddon addonType='append'>
            <InputGroupText>DFI</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </Col>
      <Col className='col-auto'>
        <Button color='outline-primary'>MAX</Button>
      </Col>
    </FormGroup>
  </div>
);

export const Switches = () => (
  <div className='container mt-5'>
    <Row className='mb-5'>
      <Col md='4'>Launch options</Col>
      <Col md='8'>
        <FormGroup>
          <FormGroup check className='mb-3'>
            <Label check className='switch'>
              <Input type='checkbox' /> Launch at login
            </Label>
          </FormGroup>
          <FormGroup check>
            <Label check className='switch'>
              <Input type='checkbox' /> Minimized at launch
            </Label>
          </FormGroup>
        </FormGroup>
      </Col>
    </Row>
  </div>
);

export const Sliders = () => (
  <div className='container mt-5'>
    <Row>
      <Col md='4'>Script verification</Col>
      <Col md='8'>
        <FormGroup className='form-row'>
          <Col md='8'>
            <Label for='scriptVerificationThreads'>Number of threads</Label>
            <Row className='align-items-center'>
              <Col className='col-auto'>
                <RangeSlider
                  min={-2}
                  max={16}
                  step={1}
                  tooltip='off'
                  id='scriptVerificationThreads'
                />
              </Col>
              Value
            </Row>
          </Col>
        </FormGroup>
      </Col>
    </Row>
  </div>
);
