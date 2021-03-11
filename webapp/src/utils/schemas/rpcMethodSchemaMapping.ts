import * as methodNames from '@defi_types/rpcMethods';
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

rpcResponseSchemaMap.set(methodNames.GET_BLOCK, rpcResponseSchemas.blockSchema);

rpcResponseSchemaMap.set(
  methodNames.GET_RAW_TRANSACTION,
  rpcResponseSchemas.txSchema
);

rpcResponseSchemaMap.set(
  methodNames.DECODE_RAW_TRANSACTION,
  rpcResponseSchemas.decodeRaxTxnSchema
);

rpcResponseSchemaMap.set(
  methodNames.FINALIZE_PSBT,
  rpcResponseSchemas.finalizePsbtSchema
);

rpcResponseSchemaMap.set(
  methodNames.WALLET_PROCESS_PSBT,
  rpcResponseSchemas.walletProcessPsbtSchema
);

rpcResponseSchemaMap.set(
  methodNames.WALLET_CREATE_FUNDED_PSBT,
  rpcResponseSchemas.walletCreateFundedPsbtSchema
);

rpcResponseSchemaMap.set(
  methodNames.LIST_UNSPENT,
  rpcResponseSchemas.listUnspentSchema
);
