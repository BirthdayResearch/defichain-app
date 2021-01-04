import React from 'react';
import '../app/App.scss';
import {
  Col,
  FormGroup,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { MdCheck } from 'react-icons/md';

export default {
  title: 'Dropdown',
};

export const Dropdowns = () => (
  <div className='container mt-5'>
    <FormGroup className='form-row align-items-center'>
      <Col md='4'>App language</Col>
      <Col md='8'>
        <UncontrolledDropdown>
          <DropdownToggle caret color='outline-secondary'>
            English
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem
              className='d-flex justify-content-between'
              value='English'
            >
              <span>English</span> <MdCheck />
            </DropdownItem>
            <DropdownItem
              className='d-flex justify-content-between'
              value='German'
            >
              <span>German</span>
            </DropdownItem>
            <DropdownItem className='d-flex justify-content-between' value='zh'>
              <span>Chinese (Simplified)</span>
            </DropdownItem>
            <DropdownItem
              className='d-flex justify-content-between'
              value='zht'
            >
              <span>Chinese (Traditional)</span>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </Col>
    </FormGroup>
  </div>
);
