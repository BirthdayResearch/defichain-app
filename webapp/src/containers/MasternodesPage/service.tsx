import RpcClient from '../../utils/rpc-client';
import isEmpty from 'lodash/isEmpty';
import { GET_NEW_ADDRESS_TYPE } from '../../constants';
import store from '../../app/rootStore';
import { CONFIG_ENABLED, RPCConfigItem } from '@defi_types/rpcConfig';
import { setMasternodesMiningInConf } from '../RpcConfiguration/reducer';
import { MasterNodeObject } from './masterNodeInterface';

export const handleFetchMasterNodes = async (): Promise<MasterNodeObject[]> => {
  const rpcClient = new RpcClient();
  const masternodes = await rpcClient.listMasterNodes();
  if (isEmpty(masternodes)) {
    return [];
  }
  const transformedData: MasterNodeObject[] = Object.keys(masternodes).map(
    (item) => ({
      hash: item,
      ...masternodes[item],
    })
  );

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

export const disableMasternodesMining = (
  mn: Partial<MasterNodeObject>
): RPCConfigItem => {
  store.dispatch(setMasternodesMiningInConf(mn));
  const { app } = store.getState();
  return app.rpcConfig;
};

export const isMasternodeEnabled = (mn: MasterNodeObject): boolean => {
  const { app } = store.getState();
  let isMasternodeEnabled = false;
  const activeNetwork = app.rpcConfig[app.activeNetwork];
  isMasternodeEnabled =
    (activeNetwork.masternode_operator?.includes(mn.operatorAuthAddress) &&
      activeNetwork.gen === CONFIG_ENABLED &&
      activeNetwork.spv === CONFIG_ENABLED) ||
    false;
  return isMasternodeEnabled;
};

export const hasAnyMasternodeEnabled = (mn: MasterNodeObject[]): boolean => {
  return mn?.length > 0 && mn.some((v: MasterNodeObject) => v.isEnabled);
};
