import React from 'react';
import { Label, Input, InputGroupAddon, InputGroupText } from 'reactstrap';
import { I18n } from 'react-redux-i18n';
import { connect } from 'react-redux';

const SettingsRowInput = (props) => {
  const {
    id,
    name,
    text,
    label,
    fieldName,
    placeholder,
    handleInputs,
    value,
  } = props;

  return (
    <>
      <Input
        type='number'
        name={`${name}`}
        value={value}
        id={`${id}`}
        placeholder={`${placeholder}`}
        onChange={(event) => handleInputs(event, `${fieldName}`)}
      />
      <Label for='pruneTo'>{label}</Label>
      {text && (
        <InputGroupAddon addonType='append'>
          <InputGroupText>
            {I18n.t(`containers.settings.${text}`)}
          </InputGroupText>
        </InputGroupAddon>
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  const { locale } = state.i18n;
  return {
    locale,
  };
};

export default connect(mapStateToProps)(SettingsRowInput);
