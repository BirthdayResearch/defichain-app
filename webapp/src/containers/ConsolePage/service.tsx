import RpcClient from '../../utils/rpc-client';

export const handleDataForQuery = async query => {
  const rpcClient = new RpcClient();
  const data = await rpcClient.getDataForCLIQuery(query);
  return data;
};
