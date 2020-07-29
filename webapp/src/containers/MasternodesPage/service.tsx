import RpcClient from '../../utils/rpc-client';
import { GET_NEW_ADDRESS_TYPE } from '../../constants';

export const handelFetchMasterNodes = async () => {
  const rpcClient = new RpcClient();
  const masternodes = await rpcClient.listMasterNodes();
  const transformedData = Object.keys(masternodes).map((item) => ({
    hash: item,
    ...masternodes[item],
  }));

  return transformedData;
};

export const handelCreateMasterNodes = async (masterNodeName) => {
  const rpcClient = new RpcClient();
  const masternodeOwner = await rpcClient.getNewAddress(
    `masternode_owner_${masterNodeName}`,
    GET_NEW_ADDRESS_TYPE
  );
  const masternodeOperator = await rpcClient.getNewAddress(
    `masternode_operator_${masterNodeName}`,
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
