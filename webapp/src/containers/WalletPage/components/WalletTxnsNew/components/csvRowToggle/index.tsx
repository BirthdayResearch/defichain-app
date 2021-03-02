import React from 'react';
import { FormGroup, Label, Input } from 'reactstrap';

export interface CsvRowToggleProps {
  label: string;
  handleCheckBox: (event: React.ChangeEvent<HTMLInputElement>) => void;
  type: string;
  id: string;
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
