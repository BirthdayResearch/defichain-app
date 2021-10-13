import BigNumber from 'bignumber.js';
import { IPCResponseModel } from '../../../../typings/common';
import store from '../../app/rootStore';
import { replaceWalletMapSync } from '../../app/service';
import RpcClient from '../../utils/rpc-client';
import { setSPVPaymentRequests } from './reducer';
import { processWalletMapAddresses } from './service';
import { WalletState } from './types';
import * as log from '../../utils/electronLogger';
import { SPVSendModel } from '../../constants/rpcModel';
import { getErrorMessage } from '../../utils/utility';
import { uid } from 'uid';
import { uniqBy } from 'lodash';
import { PaymentRequestModel } from '@defi_types/rpcConfig';
import { delayCall } from './saga';
import { ErrorMessages } from '../../constants/common';
import axios from 'axios';
import {
  API_REQUEST_TIMEOUT,
  BITCOIN_FEES_COM,
  DEFAULT_BTC_FEE,
} from '../../constants';

export const getSPVBalanceRPC = async (): Promise<string> => {
  const rpcClient = new RpcClient();
  const balance = await rpcClient.getSPVBalance();
  return new BigNumber(balance ?? 0).toFixed(8);
};

export const getSPVAddress = async (): Promise<string> => {
  const rpcClient = new RpcClient();
  const address = await rpcClient.getNewSPVAddress();
  return address;
};

export const handleNewSPVAddress = async (
  data: PaymentRequestModel,
  spvAddresses: PaymentRequestModel[]
): Promise<PaymentRequestModel[]> => {
  const { wallet } = store.getState();
  const addresses = [data, ...spvAddresses];
  updateSPVPaymentAddress(wallet, addresses);
  return addresses;
};

export const updateSPVPaymentAddress = (
  wallet: WalletState,
  spvPaymentRequests: PaymentRequestModel[]
): void => {
  store.dispatch(setSPVPaymentRequests(spvPaymentRequests));
  replaceWalletMapSync({
    ...wallet.walletMap,
    spvPaymentRequests: processWalletMapAddresses(spvPaymentRequests),
  });
};

export const setSPVPaymentAddresses = async (): Promise<
  IPCResponseModel<string>
> => {
  try {
    const { wallet } = store.getState();
    const paymentRequests = await getPaymentRequestsSPVRPC();
    updateSPVPaymentAddress(wallet, paymentRequests);
    return {
      success: true,
    };
  } catch (error) {
    log.error(error, 'setSPVPaymentAddresses');
    return {
      success: false,
    };
  }
};

export const isValidSPVAddress = async (
  toAddress: string
): Promise<boolean> => {
  const rpcClient = new RpcClient();
  try {
    return rpcClient.isValidSPVAddress(toAddress);
  } catch (err) {
    log.error(`Got error in isValidAddress: ${err}`);
    return false;
  }
};

export const sendSPVToAddress = async (
  toAddress: string,
  amount: BigNumber,
  fee: BigNumber,
  retryCount = 0
): Promise<SPVSendModel> => {
  try {
    const rpcClient = new RpcClient();
    const data = await rpcClient.sendSPVToAddress(toAddress, amount, fee);
    return data;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    if (ErrorMessages.SPV_DISCONNECTED !== errorMessage || retryCount > 49) {
      log.error(errorMessage);
      throw new Error(errorMessage);
    } else {
      delayCall();
      return await sendSPVToAddress(toAddress, amount, fee, retryCount + 1);
    }
  }
};

export const getPaymentRequestsSPVRPC = async (): Promise<
  PaymentRequestModel[]
> => {
  try {
    const rpcClient = new RpcClient();
    const receivedAddress = await rpcClient.listReceivedBySPVAddresses();
    const ownAddresses = await rpcClient.getAllSPVAddress();
    const walletMapAddress = getWalletMapSPVAddresses();
    const combinedAddress = uniqBy(
      [...receivedAddress, ...walletMapAddress],
      'address'
    );
    const finalAddresses = combinedAddress.map((pr) => {
      return { ...pr };
    });
    finalAddresses.forEach((a) => {
      a.id = a.id ?? uid();
      a.ismine = ownAddresses.includes(a.address);
      a.time = a.time ?? new Date();
      a.isSPV = true;
    });
    return finalAddresses;
  } catch (error) {
    log.error(error);
    return [];
  }
};

export const getWalletMapSPVAddresses = (): PaymentRequestModel[] => {
  const { wallet } = store.getState();
  return [...(wallet?.walletMap?.spvPaymentRequests ?? [])];
};

export const getBTCFees = async (): Promise<BigNumber> => {
  try {
    const result = await axios({
      url: BITCOIN_FEES_COM,
      method: 'GET',
      timeout: API_REQUEST_TIMEOUT,
    }) as any;
    return new BigNumber(result?.data?.fastestFee ?? 0).multipliedBy(1000);
  } catch (error) {
    log.error(error);
    return new BigNumber(DEFAULT_BTC_FEE);
  }
};
