import RpcClient from '../../utils/rpc-client';
import isEmpty from 'lodash/isEmpty';

import BitcoinIcon from '../../assets/svg/icon-coin-bitcoin-lapis.svg';
import DeefIcon from '../../assets/svg/icon-coin-deef-lapis.svg';

// TODO: Need to remove the dummy data
export const handleFetchToken = async (id: string) => {
  const rpcClient = new RpcClient();
  const tokens = await rpcClient.tokenInfo(id);
  if (isEmpty(tokens)) {
    return {};
  }
  const transformedData = Object.keys(tokens).map((item) => ({
    hash: item,
    ...tokens[item],
  }));

  return transformedData[0];

  // return dummy token data;
  return {
    name: 'Deef',
    id: 'DV2XP9ECJ9LZZJP7LK0M',
    symbol: 'DOO',
    decimals: 18,
    type: 'DCT (DeFi Custom Token)',
    holders: '999,999',
    price: '0.999 USD',
    volume: '99,999.00 USD',
    marketCap: '999,999.00 USD',
    officialSite: 'https://eatdeef.com/',
  };
};

export const handleFetchTokens = async () => {
  const rpcClient = new RpcClient();
  const tokens = await rpcClient.listTokens();
  if (isEmpty(tokens)) {
    return [];
  }
  const transformedData = Object.keys(tokens).map((item) => ({
    hash: item,
    ...tokens[item],
  }));

  return transformedData;
  // return dummy tokens data;
  return [
    {
      name: 'DeFi Bitcoin',
      icon: BitcoinIcon,
      symbol: 'DBTC',
      type: 'DAT',
      price: '0.999 USD',
      volume: '99,999 USD',
      marketCap: '999,999 USD',
      holders: '999,999',
    },
    {
      name: 'DeFi Bitcoin',
      icon: BitcoinIcon,
      symbol: 'DBTC',
      type: 'DAT',
      price: '0.999 USD',
      volume: '99,999 USD',
      marketCap: '999,999 USD',
      holders: '999,999',
    },
    {
      name: 'DeFi Bitcoin',
      icon: BitcoinIcon,
      symbol: 'DBTC',
      type: 'DAT',
      price: '0.999 USD',
      volume: '99,999 USD',
      marketCap: '999,999 USD',
      holders: '999,999',
    },
    {
      name: 'DeFi Bitcoin',
      icon: BitcoinIcon,
      symbol: 'DBTC',
      type: 'DAT',
      price: '0.999 USD',
      volume: '99,999 USD',
      marketCap: '999,999 USD',
      holders: '999,999',
    },
    {
      name: 'DeFi Bitcoin',
      icon: BitcoinIcon,
      symbol: 'DBTC',
      type: 'DAT',
      price: '0.999 USD',
      volume: '99,999 USD',
      marketCap: '999,999 USD',
      holders: '999,999',
    },
    {
      name: 'Deef',
      icon: DeefIcon,
      symbol: 'DOO',
      id: 'DV2XP9ECJ9LZZJP7LK0M',
      totalInitialSupply: '99,999,999',
      finalSupplyLimit: '999,999,999',
      mintingSupport: 'Yes',
      tradeable: 'Yes',
    },
    {
      name: 'Deef',
      icon: DeefIcon,
      symbol: 'DOO',
      id: 'DV2XP9ECJ9LZZJP7LK0M',
      totalInitialSupply: '99,999,999',
      finalSupplyLimit: '999,999,999',
      mintingSupport: 'Yes',
      tradeable: 'Yes',
    },
  ];
};

export const handleTokenTransfers = async (id: string) => {
  // return dummy tokens data;
  return [
    {
      txnhash: 'a870a10234ea870a10234ea870a10234ea870a',
      age: '28s ago',
      from: 'a870a10234ea870a10234ea870a10234ea870a',
      to: 'a870a10234ea870a10234ea870a10234ea870a',
      amount: '101.8414562',
    },
    {
      txnhash: 'a870a10234ea870a10234ea870a10234ea870a',
      age: '28s ago',
      from: 'a870a10234ea870a10234ea870a10234ea870a',
      to: 'a870a10234ea870a10234ea870a10234ea870a',
      amount: '101.8414562',
    },
    {
      txnhash: 'a870a10234ea870a10234ea870a10234ea870a',
      age: '28s ago',
      from: 'a870a10234ea870a10234ea870a10234ea870a',
      to: 'a870a10234ea870a10234ea870a10234ea870a',
      amount: '101.8414562',
    },
    {
      txnhash: 'a870a10234ea870a10234ea870a10234ea870a',
      age: '28s ago',
      from: 'a870a10234ea870a10234ea870a10234ea870a',
      to: 'a870a10234ea870a10234ea870a10234ea870a',
      amount: '101.8414562',
    },
    {
      txnhash: 'a870a10234ea870a10234ea870a10234ea870a',
      age: '28s ago',
      from: 'a870a10234ea870a10234ea870a10234ea870a',
      to: 'a870a10234ea870a10234ea870a10234ea870a',
      amount: '101.8414562',
    },
    {
      txnhash: 'a870a10234ea870a10234ea870a10234ea870a',
      age: '28s ago',
      from: 'a870a10234ea870a10234ea870a10234ea870a',
      to: 'a870a10234ea870a10234ea870a10234ea870a',
      amount: '101.8414562',
    },
    {
      txnhash: 'a870a10234ea870a10234ea870a10234ea870a',
      age: '28s ago',
      from: 'a870a10234ea870a10234ea870a10234ea870a',
      to: 'a870a10234ea870a10234ea870a10234ea870a',
      amount: '101.8414562',
    },
    {
      txnhash: 'a870a10234ea870a10234ea870a10234ea870a',
      age: '28s ago',
      from: 'a870a10234ea870a10234ea870a10234ea870a',
      to: 'a870a10234ea870a10234ea870a10234ea870a',
      amount: '101.8414562',
    },
    {
      txnhash: 'a870a10234ea870a10234ea870a10234ea870a',
      age: '28s ago',
      from: 'a870a10234ea870a10234ea870a10234ea870a',
      to: 'a870a10234ea870a10234ea870a10234ea870a',
      amount: '101.8414562',
    },
    {
      txnhash: 'a870a10234ea870a10234ea870a10234ea870a',
      age: '28s ago',
      from: 'a870a10234ea870a10234ea870a10234ea870a',
      to: 'a870a10234ea870a10234ea870a10234ea870a',
      amount: '101.8414562',
    },
    {
      txnhash: 'a870a10234ea870a10234ea870a10234ea870a',
      age: '28s ago',
      from: 'a870a10234ea870a10234ea870a10234ea870a',
      to: 'a870a10234ea870a10234ea870a10234ea870a',
      amount: '101.8414562',
    },
  ];
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
