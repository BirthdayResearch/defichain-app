import { BigNumber } from 'bignumber.js';
import { DFI_UNIT_MAP } from '../constants';

export const unitConversion = (
  from: string,
  to: string,
  value: number | string
): BigNumber => {
  const unitMap = DFI_UNIT_MAP;
  const fromUnit = unitMap[from];
  const toUnit = unitMap[to];
  if (!(fromUnit && toUnit)) {
    throw new Error('InValid from/to Unit');
  }
  return conversion(fromUnit, toUnit, value);
};

const conversion = (
  from: string,
  to: string,
  value: string | number
): BigNumber => {
  const bigNumber = new BigNumber(value);
  return bigNumber.multipliedBy(from).dividedBy(to);
};
