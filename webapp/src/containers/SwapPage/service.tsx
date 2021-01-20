import _ from 'lodash';

import { DFI_SYMBOL, POOL_PAIR_PAGE_SIZE } from '../../constants';
import RpcClient from '../../utils/rpc-client';
import {
  fetchPoolPairDataWithPagination,
  getAddressAndAmountListForAccount,
  getAddressForSymbol,
  handleAccountToAccountConversion,
  handleUtxoToAccountConversion,
} from '../../utils/utility';
import BigNumber from 'bignumber.js';
import store from '../../app/rootStore';
import { poolSwapRefreshUTXOSuccess } from './reducer';

export const handleFetchPoolPairList = async () => {
  const rpcClient = new RpcClient();
  const poolPairList: any[] = await fetchPoolPairDataWithPagination(
    0,
    POOL_PAIR_PAGE_SIZE,
    rpcClient.listPoolPairs
  );
  return poolPairList;
};

export const handleTestPoolSwapTo = async (formState) => {
  const rpcClient = new RpcClient();
  const list = await getAddressAndAmountListForAccount();
  const { address: address1, amount: maxAmount1 } = await getAddressForSymbol(
    formState.hash1,
    list
  );

  const address2 = formState.receiveAddress;

  if (new BigNumber(formState.amount1).toNumber()) {
    const testPoolSwapAmount = await rpcClient.testPoolSwap(
      address1,
      formState.hash1,
      Number(formState.amount1),
      address2,
      formState.hash2
    );
    return testPoolSwapAmount.split('@')[0];
  } else {
    return '-';
  }
};

export const handleTestPoolSwapFrom = async (formState) => {
  const rpcClient = new RpcClient();
  const list = await getAddressAndAmountListForAccount();
  const address2 = formState.receiveAddress;
  const { address: address1, amount: maxAmount1 } = await getAddressForSymbol(
    formState.hash1,
    list
  );

  if (new BigNumber(formState.amount2).toNumber()) {
    const testPoolSwapAmount = await rpcClient.testPoolSwap(
      address2,
      formState.hash2,
      Number(formState.amount2),
      address1,
      formState.hash1
    );
    return testPoolSwapAmount.split('@')[0];
  } else {
    return '-';
  }
};

export const handlePoolSwap = async (formState) => {
  const rpcClient = new RpcClient();
  const list = await getAddressAndAmountListForAccount();
  const { address: address1, amount: maxAmount1 } = await getAddressForSymbol(
    formState.hash1,
    list
  );

  let accountToAccountAmount = new BigNumber(0);

  // convert account to account, if don't have sufficient funds in one account
  if (new BigNumber(formState.amount1).gt(maxAmount1)) {
    accountToAccountAmount = await handleAccountToAccountConversion(
      list,
      address1,
      formState.hash1
    );
  }

  // convert utxo to account DFI, if don't have sufficent funds in account
  if (
    formState.hash1 === DFI_SYMBOL &&
    new BigNumber(formState.amount1).gt(accountToAccountAmount.plus(maxAmount1))
  ) {
    await handleUtxoToAccountConversion(
      formState.hash1,
      address1,
      formState.amount1,
      accountToAccountAmount.plus(maxAmount1).toNumber()
    );
  }

  store.dispatch(poolSwapRefreshUTXOSuccess());

  const hash = await rpcClient.poolSwap(
    address1,
    formState.hash1,
    Number(formState.amount1),
    formState.receiveAddress,
    formState.hash2
  );
  return hash;
};
