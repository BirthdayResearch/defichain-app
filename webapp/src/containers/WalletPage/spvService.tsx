import BigNumber from 'bignumber.js';
import { IPCResponseModel } from '../../../../typings/common';
import store from '../../app/rootStore';
import { replaceWalletMapSync } from '../../app/service';
import RpcClient from '../../utils/rpc-client';
import { PaymentRequestModel } from './components/ReceivePage/CreateNewAddressPage';
import { setSPVPaymentRequests } from './reducer';
import { getPaymentRequestsSPVRPC, processWalletMapAddresses } from './service';
import { WalletState } from './types';
import * as log from '../../utils/electronLogger';
import { SPVSendModel } from '../../constants/rpcModel';
import { getErrorMessage } from '../../utils/utility';

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
  amount: BigNumber
): Promise<SPVSendModel> => {
  try {
    const rpcClient = new RpcClient();
    const data = rpcClient.sendSPVToAddress(toAddress, amount);
    return data;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    log.error(errorMessage);
    throw new Error(errorMessage);
  }
};
