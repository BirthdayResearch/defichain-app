import RpcClient from '../../utils/rpc-client';
import * as log from '../../utils/electronLogger';
import isEmpty from 'lodash/isEmpty';
import { GET_NEW_ADDRESS_TYPE } from '../../constants';

export const isValidAddress = async (toAddress: string) => {
  const rpcClient = new RpcClient();
  try {
    return rpcClient.isValidAddress(toAddress);
  } catch (err) {
    log.error(`Got error in isValidAddress: ${err}`);
    return false;
  }
};

export const handelFetchMasterNodes = async () => {
  const rpcClient = new RpcClient();
  const masternodes = await rpcClient.listMasterNodes();
  if (isEmpty(masternodes)) {
    return [];
  }
  const transformedData = Object.keys(masternodes).map((item) => ({
    hash: item,
    ...masternodes[item],
  }));

  return transformedData;
};

export const handelCreateMasterNodes = async () => {
  const rpcClient = new RpcClient();

  const masternodeOwner = await rpcClient.getNewAddress(
    null,
    GET_NEW_ADDRESS_TYPE
  );

  const masternodeOperator = await rpcClient.getNewAddress(
    null,
    GET_NEW_ADDRESS_TYPE
  );

  const masterNodeHash = await rpcClient.createMasterNode({
    operatorAuthAddress: masternodeOperator,
    collateralAddress: masternodeOwner,
  });

  return {
    masternodeOperator,
    masternodeOwner,
    masterNodeHash,
  };
};

export const handleResignMasterNode = (masterNodeId) => {
  const rpcClient = new RpcClient();
  return rpcClient.resignMasterNode(masterNodeId);
};

export const getPrivateKey = (address: string) => {
  const rpcClient = new RpcClient();
  return rpcClient.dumpPrivKey(address);
};

export const importPrivateKey = (address: string) => {
  const rpcClient = new RpcClient();
  return rpcClient.importPrivKey(address);
};

export const getAddressInfo = (address) => {
  const rpcClient = new RpcClient();
  return rpcClient.getaddressInfo(address);
};
