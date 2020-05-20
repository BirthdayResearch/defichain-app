import * as methodNames from '../../constants/rpcMethods';
import * as rpcResponseSchemas from './rpcResponseSchema';

export const rpcResponseSchemaMap = new Map<string, object>();

rpcResponseSchemaMap.set(
  methodNames.GET_BALANCE,
  rpcResponseSchemas.getBalanceSchema
);

rpcResponseSchemaMap.set(
  methodNames.GET_BLOCK_COUNT,
  rpcResponseSchemas.getBlockCountSchema
);

rpcResponseSchemaMap.set(
  methodNames.GET_PEER_INFO,
  rpcResponseSchemas.getPeerInfoSchema
);

rpcResponseSchemaMap.set(
  methodNames.GET_NEW_ADDRESS,
  rpcResponseSchemas.getNewAddressSchema
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

rpcResponseSchemaMap.set(
  methodNames.LIST_TRANSACTIONS,
  rpcResponseSchemas.txnListSchema
);

rpcResponseSchemaMap.set(
  methodNames.GET_WALLET_INFO,
  rpcResponseSchemas.walletInfoSchema
);

rpcResponseSchemaMap.set(
  methodNames.GET_BALANCES,
  rpcResponseSchemas.getBalancesSchema
);
