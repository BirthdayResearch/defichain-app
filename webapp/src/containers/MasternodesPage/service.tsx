import RpcClient from '../../utils/rpc-client';

export const handelFetchMasterNodes = () => {
  const data = {
    result: {
      '2a7ddddb0056bd814a580ec3a0420d6316a198e6ca60267f1d04cd6abe2ba31e': {
        ownerAuthAddress: '7BQZ67KKYWSmVRukgv57m4HorjbGh7NWrQ',
        operatorAuthAddress: '7GULFtS6LuJfJEikByKKg8psscg84jnfHs',
        creationHeight: 0,
        resignHeight: -1,
        resignTx:
          '0000000000000000000000000000000000000000000000000000000000000000',
        banHeight: -1,
        banTx:
          '0000000000000000000000000000000000000000000000000000000000000000',
        state: 'ENABLED',
        mintedBlocks: 12008,
      },
      ec394fdd294275ec09579fe2cb9df1d4dff852d1457cf18985a8813986716861: {
        ownerAuthAddress: '7E8Cjn9cqEwnrc3E4zN6c5xKxDSGAyiVUM',
        operatorAuthAddress: '78MWNEcAAJxihddCw1UnZD8T7fMWmUuBro',
        creationHeight: 0,
        resignHeight: -1,
        resignTx:
          '0000000000000000000000000000000000000000000000000000000000000000',
        banHeight: -1,
        banTx:
          '0000000000000000000000000000000000000000000000000000000000000000',
        state: 'ENABLED',
        mintedBlocks: 35649,
      },
      '33bd4108881acd5f106c9c43de160683b6f477a1e499cbeb5ccfea09dc46c874': {
        ownerAuthAddress: 'tf1qxteztd6jez99gq0q3gxkm4lhsv00yxj9egmv9a',
        operatorAuthAddress: 'tf1qxteztd6jez99gq0q3gxkm4lhsv00yxj9egmv9a',
        creationHeight: 95655,
        resignHeight: -1,
        resignTx:
          '0000000000000000000000000000000000000000000000000000000000000000',
        banHeight: -1,
        banTx:
          '0000000000000000000000000000000000000000000000000000000000000000',
        state: 'ENABLED',
        mintedBlocks: 0,
      },
      d974445172d94e25468575ccbd3de28dd8c3231276e700b1b17f2e7589b3d1ac: {
        ownerAuthAddress: '7GxxMCh7sJsvRK4GXLX5Eyh9B9EteXzuum',
        operatorAuthAddress: '7MYdTGv3bv3z65ai6y5J1NFiARg8PYu4hK',
        creationHeight: 0,
        resignHeight: -1,
        resignTx:
          '0000000000000000000000000000000000000000000000000000000000000000',
        banHeight: -1,
        banTx:
          '0000000000000000000000000000000000000000000000000000000000000000',
        state: 'ENABLED',
        mintedBlocks: 11879,
      },
      '0e252cecef2581006eb4bf503dd430c403f2f0a8b54519c2b222c601e0f0c2d2': {
        ownerAuthAddress: '7LMorkhKTDjbES6DfRxX2RiNMbeemUkxmp',
        operatorAuthAddress: '7KEu9JMKCx6aJ9wyg138W3p42rjg19DR5D',
        creationHeight: 0,
        resignHeight: -1,
        resignTx:
          '0000000000000000000000000000000000000000000000000000000000000000',
        banHeight: -1,
        banTx:
          '0000000000000000000000000000000000000000000000000000000000000000',
        state: 'ENABLED',
        mintedBlocks: 38166,
      },
      e98f13531e1f6f7c2dccbe2bf3ac42dfc76e603cf00e8fa6dda3977ac99e08dd: {
        ownerAuthAddress: '75SPByUNfab8GhLoaNET7Xa9f7pTJixx6B',
        operatorAuthAddress: '73yXqLqJn4yNK7cGYxs2gzASdUtqNbDyCq',
        creationHeight: 97692,
        resignHeight: -1,
        resignTx:
          '0000000000000000000000000000000000000000000000000000000000000000',
        banHeight: -1,
        banTx:
          '0000000000000000000000000000000000000000000000000000000000000000',
        state: 'ENABLED',
        mintedBlocks: 0,
      },
    },
  };
  const transformedData = Object.keys(data.result).map(item => ({
    hash: item,
    ...data.result[item],
  }));
  return transformedData;
};

export const handelCreateMasterNodes = async masterNodeName => {
  const rpcClient = new RpcClient();
  const masternodeOwner = await rpcClient.getNewAddress(
    `masternode_owner_${masterNodeName}`
  );
  const masternodeOperator = await rpcClient.getNewAddress(
    `masternode_operator_${masterNodeName}`
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

export const handleResignMasterNode = masterNodeId => {
  const rpcClient = new RpcClient();
  return rpcClient.resignMasterNode(masterNodeId);
};
