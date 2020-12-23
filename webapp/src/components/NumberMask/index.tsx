import React from 'react';
import NumberFormat from 'react-number-format';

export interface NumberMaskProps {
  value: string;
  defaultValue?: string | number;
}

const NumberMask: React.FunctionComponent<NumberMaskProps> = (
  props: NumberMaskProps
) => {
  return (
    <NumberFormat
      value={props.value.toString()}
      defaultValue={props.defaultValue ?? 0}
      displayType={'text'}
      thousandSeparator={true}
      isNumericString={true}
    />
  );
};

export default NumberMask;
