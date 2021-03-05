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

interface SettingsRowDropDownProps {
  label: string;
  data: {
    value: number | string;
    label: string;
  }[];
  field: number | string;
  fieldName: string;
  children?: React.ReactNode;
  handleDropDowns: (data: any, field: any) => any;
  disabled?: () => boolean;
}

export const getDropdownLabel = (
  list: { value: string | number; label: string }[],
  value: string | number
): string => {
  if (list.length > 0) {
    const index = list.findIndex((obj) => obj.value === value);
    if (index === -1) {
      return list[0].label;
    } else {
      return list[index].label;
    }
  }
  return '';
};

const SettingsRowDropDown = (props: SettingsRowDropDownProps) => {
  const { label, data, field, fieldName, handleDropDowns, disabled } = props;

  return (
    <FormGroup className='form-row align-items-center'>
      <Col md='4'>{I18n.t(label)}</Col>
      <Col md='8'>
        <UncontrolledDropdown>
          <DropdownToggle
            disabled={disabled ? disabled() : false}
            caret
            color='outline-secondary'
          >
            {I18n.t(getDropdownLabel(data, field))}
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
                  <span>{I18n.t(object.label)}</span>
                  &nbsp;
                  {field === object.value && <MdCheck />}
                </DropdownItem>
              );
            })}
          </DropdownMenu>
        </UncontrolledDropdown>
        {props.children}
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
