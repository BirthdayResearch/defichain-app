import React from 'react';
import {
  Label,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from 'reactstrap';
import { I18n } from 'react-redux-i18n';
import { connect } from 'react-redux';

const SettingsRowInput = props => {
  const {
    id,
    name,
    text,
    label,
    field,
    fieldName,
    placeholder,
    handleInputs,
  } = props;

  return (
    <InputGroup>
      <Input
        type='text'
        name={`${name}`}
        id={`${id}`}
        placeholder={`${placeholder}`}
        value={field || ''}
        onChange={event => handleInputs(event, `${fieldName}`)}
      />
      <Label for='pruneTo'>{I18n.t(`containers.settings.${label}`)}</Label>
      {text && (
        <InputGroupAddon addonType='append'>
          <InputGroupText>
            {I18n.t(`containers.settings.${text}`)}
          </InputGroupText>
        </InputGroupAddon>
      )}
    </InputGroup>
  );
};

const mapStateToProps = state => {
  const { locale } = state.i18n;
  return {
    locale,
  };
};

export default connect(mapStateToProps)(SettingsRowInput);
