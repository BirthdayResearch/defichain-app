import * as methodNames from '../../constants/rpcMethods';
import * as rpcResponseSchemas from './rpcResponseSchema';

export const rpcResponseSchemaMap = new Map<string, object>();

rpcResponseSchemaMap.set(
  methodNames.GET_BALANCE,
  rpcResponseSchemas.getBalanceSchema
);

rpcResponseSchemaMap.set(
  methodNames.GET_BLOCKCHAIN_INFO,
  rpcResponseSchemas.blockchainInfoSchema
);

rpcResponseSchemaMap.set(
  methodNames.VALIDATE_ADDRESS,
  rpcResponseSchemas.validAddressSchema
);

rpcResponseSchemaMap.set(
  methodNames.LIST_RECEIVED_BY_ADDRESS,
  rpcResponseSchemas.receiveAddressListSchema
);
