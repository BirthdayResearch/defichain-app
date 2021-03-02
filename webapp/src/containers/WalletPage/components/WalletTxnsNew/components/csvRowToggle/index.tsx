import React from 'react';
import { FormGroup, Label, Input } from 'reactstrap';

export interface CsvRowToggleProps {
  label: string;
  handleCheckBox: () => void;
}

const CsvRowToggle: React.FunctionComponent<CsvRowToggleProps> = (props) => {
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
