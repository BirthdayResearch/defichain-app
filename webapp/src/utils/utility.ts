import Ajv from 'ajv';
import log from 'loglevel';
import { IAddressAndAmount } from './interfaces';

export const validateSchema = (schema, data) => {
  const ajv = new Ajv({ allErrors: true });
  const validate = ajv.compile(schema);
  const valid = validate(data);

  if (!valid) {
    log.error(validate.errors);
  }
  return valid;
};

export const getAddressAndAmount = async addresses => {
  const addressAndAmount: IAddressAndAmount[] = [];
  for (const addressObj of addresses) {
    addressAndAmount.push({
      address: addressObj.address,
      amount: addressObj.amount,
    });
  }
  return addressAndAmount;
};
