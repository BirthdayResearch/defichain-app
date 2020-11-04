import RpcClient from '../../utils/rpc-client';
import isEmpty from 'lodash/isEmpty';
import {
  DEFAULT_DFI_FOR_ACCOUNT_TO_ACCOUNT,
  LIST_TOKEN_PAGE_SIZE,
  UNDEFINED_STRING,
} from '../../constants';
import { sleep } from '../WalletPage/service';
import { fetchTokenDataWithPagination } from '../../utils/utility';

export const getAddressInfo = (address) => {
  const rpcClient = new RpcClient();
  return rpcClient.getaddressInfo(address);
};

// TODO: Need to remove the dummy data
export const handleFetchToken = async (id: string) => {
  const rpcClient = new RpcClient();
  const tokens = await rpcClient.tokenInfo(id);
  if (isEmpty(tokens)) {
    return {};
  }
  const transformedData = Object.keys(tokens).map(async (item) => {
    const { collateralAddress } = tokens[item];
    let addressInfo;
    if (collateralAddress && collateralAddress !== UNDEFINED_STRING) {
      addressInfo = await getAddressInfo(collateralAddress);
    }

    return {
      ismine: addressInfo && addressInfo.ismine,
      hash: item,
      ...tokens[item],
    };
  });

  return Promise.resolve(transformedData[0]);
};

export const getTransactionInfo = async (txId): Promise<any> => {
  const rpcClient = new RpcClient();
  const txInfo = await rpcClient.getTransaction(txId);
  if (!txInfo.blockhash && txInfo.confirmations === 0) {
    await sleep(3000);
    await getTransactionInfo(txId);
  } else {
    return;
  }
};

export const handleFetchTokens = async () => {
  const rpcClient = new RpcClient();
  return await fetchTokenDataWithPagination(
    0,
    LIST_TOKEN_PAGE_SIZE,
    rpcClient.listTokens
  );
};

export const handleTokenTransfers = async (id: string) => {
  return [];
};

export const handleCreateTokens = async (tokenData) => {
  const data = {
    name: tokenData.name,
    symbol: tokenData.symbol,
    isDAT: tokenData.isDAT,
    decimal: Number(tokenData.decimal),
    limit: Number(tokenData.limit),
    mintable: JSON.parse(tokenData.mintable),
    tradeable: JSON.parse(tokenData.tradeable),
    collateralAddress: tokenData.collateralAddress,
  };
  if (!tokenData.name) {
    delete data.name;
  }
  const rpcClient = new RpcClient();
  const hash = await rpcClient.createToken(data);
  return {
    hash,
  };
};

export const handleMintTokens = async (tokenData) => {
  const { address } = tokenData;
  const rpcClient = new RpcClient();
  const txId = await rpcClient.sendToAddress(
    address,
    DEFAULT_DFI_FOR_ACCOUNT_TO_ACCOUNT,
    true
  );
  await getTransactionInfo(txId);
  const hash = await rpcClient.mintToken(tokenData);
  return {
    hash,
  };
};

export const handleUpdateTokens = async (tokenData) => {
  const data = {
    name: tokenData.name,
    token: tokenData.symbol,
    isDAT: tokenData.isDAT,
    decimal: Number(tokenData.decimal),
    limit: Number(tokenData.limit),
    mintable: JSON.parse(tokenData.mintable),
    tradeable: JSON.parse(tokenData.tradeable),
  };
  if (!tokenData.name) {
    delete data.name;
  }
  const rpcClient = new RpcClient();
  const hash = await rpcClient.updateToken(data);
  return {
    hash,
  };
};

export const handleDestroyToken = (tokenId) => {
  const rpcClient = new RpcClient();
  return rpcClient.destroyToken(tokenId);
};

export const getReceivingAddressAndAmountList = async () => {
  const rpcClient = new RpcClient();
  const addressAndAmountList = await rpcClient.getReceivingAddressAndAmountList();
  return {
    addressAndAmountList,
  };
};
