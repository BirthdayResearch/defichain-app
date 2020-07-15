import React from 'react';
import '../app/App.scss';
import { Row, Col, FormGroup, Label } from 'reactstrap';
import RangeSlider from 'react-bootstrap-range-slider';

export default {
  title: 'Slider',
};

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
