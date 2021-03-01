import React from 'react';
import { FormGroup, Label, Input } from 'reactstrap';

const CsvRowToggle = (props) => {
  const { label, handleCheckBox } = props;

  return (
    <FormGroup>
      <FormGroup check>
        <Label check className='switch'>
          <Input type='checkbox' onChange={handleCheckBox} />
          &nbsp;
          {label}
        </Label>
      </FormGroup>
    </FormGroup>
  );
};

export default CsvRowToggle;
