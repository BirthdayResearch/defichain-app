import _ from 'lodash';
import * as log from '../../utils/electronLogger';

import {
  AMOUNT_SEPARATOR,
  DFI_SYMBOL,
  POOL_PAIR_PAGE_SIZE,
} from '../../constants';
import RpcClient from '../../utils/rpc-client';
import {
  fetchPoolPairDataWithPagination,
  getAddressAndAmountListForAccount,
  getHighestAmountAddressForSymbol,
  handleAccountToAccountConversion,
  handleUtxoToAccountConversion,
  utxoLedger,
  handleUtxoToAccountConversionLedger, getAddressAndAmountListForLedger, getKeyIndexAddressLedger, getNetworkType,
} from '@/utils/utility';
import BigNumber from 'bignumber.js';
import store from '../../app/rootStore';
import { poolSwapRefreshUTXOSuccess } from './reducer';
import { ipcRendererFunc } from '@/utils/isElectron';
import { CUSTOM_TX_LEDGER } from '@defi_types/ipcEvents';
import { TypeWallet } from '@/typings/entities';

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
  log.info('Starting', 'handleTestPoolSwapTo');
  const address = formState.receiveAddress;

  if (new BigNumber(formState.amount1).toNumber()) {
    const testPoolSwapAmount = await rpcClient.testPoolSwap(
      address,
      formState.hash1,
      new BigNumber(formState.amount1),
      address,
      formState.hash2
    );
    return testPoolSwapAmount.split(AMOUNT_SEPARATOR)[0];
  } else {
    return '-';
  }
};

export const handleTestPoolSwapFrom = async (formState) => {
  const rpcClient = new RpcClient();
  log.info('Starting', 'handleTestPoolSwapFrom');
  const address = formState.receiveAddress;

  if (new BigNumber(formState.amount2).toNumber()) {
    const testPoolSwapAmount = await rpcClient.testPoolSwap(
      address,
      formState.hash2,
      new BigNumber(formState.amount2),
      address,
      formState.hash1
    );
    return testPoolSwapAmount.split(AMOUNT_SEPARATOR)[0];
  } else {
    return '-';
  }
};

export const handlePoolSwap = async (formState, typeWallet: TypeWallet = 'ledger'): Promise<string> => {
  const rpcClient = new RpcClient();
  log.info('Starting', 'handlePoolSwap');
  let list;
  if (typeWallet === 'wallet') {
    list = await getAddressAndAmountListForAccount();
  } else {
    list = await getAddressAndAmountListForLedger();
  }
  const {
    address: address1,
    amount: maxAmount1,
  } = getHighestAmountAddressForSymbol(formState.hash1, list, undefined, typeWallet);
  const swapAddress =
    address1 === '' || address1 == null ? formState.receiveAddress : address1;
  let accountToAccountAmount = new BigNumber(0);
  const poolSwapAmount = new BigNumber(formState.amount1);

  log.info(`1. Address ${address1} Amount ${maxAmount1}`, 'handlePoolSwap');
  // convert account to account, if don't have sufficient funds in one account
  if (poolSwapAmount.gt(maxAmount1)) {
    log.info(`Account to Account with ${swapAddress}`, 'handlePoolSwap');
    accountToAccountAmount = await handleAccountToAccountConversion(
      list,
      swapAddress,
      formState.hash1,
      typeWallet,
    );
  }

  // convert utxo to account DFI, if don't have sufficent funds in account
  if (
    formState.hash1 === DFI_SYMBOL &&
    poolSwapAmount.gt(accountToAccountAmount.plus(maxAmount1))
  ) {
    log.info(`UTXOs to Account with ${swapAddress}`, 'handlePoolSwap');
    if (typeWallet === 'wallet') {
      await handleUtxoToAccountConversion(
        formState.hash1,
        swapAddress,
        poolSwapAmount,
        accountToAccountAmount.plus(maxAmount1)
      );
    } else {
      await handleUtxoToAccountConversionLedger(
        formState.hash1,
        swapAddress,
        poolSwapAmount,
        accountToAccountAmount.plus(maxAmount1),
      );
    }
  }

  log.info(`Refresh Pool Swap`, 'handlePoolSwap');
  store.dispatch(poolSwapRefreshUTXOSuccess());

  log.info(`Starting Pool Swap RPC`, 'handlePoolSwap');
  let hash = '';
  if (typeWallet === 'wallet') {
    hash = await rpcClient.poolSwap(
      swapAddress,
      formState.hash1,
      poolSwapAmount,
      formState.receiveAddress,
      formState.hash2
    );
  } else {
    const { utxo } = await utxoLedger(swapAddress, formState.amount1);
    const ipcRenderer = ipcRendererFunc();
    const network = getNetworkType();
    const keyIndex = getKeyIndexAddressLedger(network, swapAddress);
    const res = await ipcRenderer.sendSync(CUSTOM_TX_LEDGER, {
      utxo,
      address: swapAddress,
      amount: 0,
      data: {
        txType: 's',
        customData: {
          from: swapAddress,
          idTokenFrom: formState.hash1,
          amountFrom: poolSwapAmount.toNumber(),
          to: formState.receiveAddress,
          idTokenTo: formState.hash2,
        },
        tokenId: 0,
      },
      keyIndex,
    });
    if (res.success) {
      log.info(res.data.tx)
      hash = await rpcClient.sendRawTransaction(res.data.tx);
    } else {
      throw new Error(res.message);
    }
  }
  log.info(`${hash}`, 'handlePoolSwap');
  return hash;
};
