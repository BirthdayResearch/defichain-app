import React from 'react';
import {
  Col,
  FormGroup,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { I18n } from 'react-redux-i18n';
import { MdCheck } from 'react-icons/md';
import { connect } from 'react-redux';

const SettingsRowDropDown = (props) => {
  const { label, data, field, fieldName, getLabel, handleDropDowns } = props;

  return (
    <FormGroup className='form-row align-items-center'>
      <Col md='4'>{I18n.t(`containers.settings.${label}`)}</Col>
      <Col md='8'>
        <UncontrolledDropdown>
          <DropdownToggle caret color='outline-secondary'>
            {I18n.t(`containers.settings.${getLabel(data, field)}`)}
          </DropdownToggle>
          <DropdownMenu>
            {data.map((object) => {
              return (
                <DropdownItem
                  className='d-flex justify-content-between'
                  key={object.value}
                  onClick={() => handleDropDowns(object.value, `${fieldName}`)}
                  value={object.value}
                >
                  <span>{I18n.t(`containers.settings.${object.label}`)}</span>
                  &nbsp;
                  {field === object.value && <MdCheck />}
                </DropdownItem>
              );
            })}
          </DropdownMenu>
        </UncontrolledDropdown>
      </Col>
    </FormGroup>
  );
};

const mapStateToProps = (state) => {
  const { locale } = state.i18n;
  return {
    locale,
  };
};

export default connect(mapStateToProps)(SettingsRowDropDown);
