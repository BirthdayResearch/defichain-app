import BigNumber from 'bignumber.js';
import RpcClient from '../../utils/rpc-client';

export const getSPVBalanceRPC = async (): Promise<string> => {
  const rpcClient = new RpcClient();
  const balance = await rpcClient.getSPVBalance();
  return new BigNumber(balance ?? 0).toFixed(8);
};
