import { isEmpty } from 'lodash';
import RpcClient from '../../utils/rpc-client';

export const handleFetchPoolPairList = async () => {
  const rpcClient = new RpcClient();
  const poolPairs = await rpcClient.listPoolPairs();
  if (isEmpty(poolPairs)) {
    return [];
  }
  const transformedData = Object.keys(poolPairs).map((item) => ({
    ...poolPairs[item],
  }));
  return transformedData;
};
