import React from 'react';
import { Label, Input, InputGroupAddon, InputGroupText } from 'reactstrap';
import { I18n } from 'react-redux-i18n';

const RenameRowInput = (props) => {
  const { id, name, label, placeholder, value } = props;

  return (
    <>
      <Input
        type='text'
        name={`${name}`}
        value={value}
        id={`${id}`}
        placeholder={`${placeholder}`}
      />
      <Label for='pruneTo'>{label}</Label>
    </>
  );
};

export default RenameRowInput;
