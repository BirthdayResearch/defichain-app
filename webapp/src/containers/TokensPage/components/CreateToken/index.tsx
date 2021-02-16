import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { TabContent, TabPane } from 'reactstrap';
import isEmpty from 'lodash/isEmpty';

import DCTDistribution from './DCTDistribution';
import CreateDCT from './CreateDCT';
import { createToken, fetchTokenInfo, updateTokenRequest } from '../../reducer';
import {
  getReceivingAddressAndAmountList,
  getReceivingAddressAndAmountListLedger,
} from '../../service';
import {
  CONFIRM_BUTTON_COUNTER,
  CONFIRM_BUTTON_TIMEOUT,
  CREATE_DCT,
  DCT_DISTRIBUTION,
  MINIMUM_DFI_REQUIRED_FOR_TOKEN_CREATION,
} from '@/constants';
import { ITokenResponse } from '@/utils/interfaces';
import { PaymentRequestLedger } from '@/typings/models';
import { TypeWallet } from '@/typings/entities';
import { PaymentRequestModel } from '../../../WalletPage/components/ReceivePage/PaymentRequestList';
import { AddressModel } from '../../../../model/address.model';

interface RouteParams {
  id?: string;
}

interface CreateTokenProps extends RouteComponentProps<RouteParams> {
  tokenInfo: any;
  fetchToken: (id: string | undefined) => void;
  createToken: (tokenData, typeWallet: TypeWallet) => void;
  updateToken: (tokenData, typeWallet: TypeWallet) => void;
  createdTokenData: ITokenResponse;
  updatedTokenData: ITokenResponse;
  isTokenUpdating: boolean;
  isErrorUpdatingToken: string;
  isTokenCreating: boolean;
  isErrorCreatingToken: string;
  paymentRequests: PaymentRequestModel[];
  paymentRequestsLedger: PaymentRequestLedger[];
}

export interface CreateTokenFormState extends AddressModel {
  [key: string]: any;
}

const CreateToken: React.FunctionComponent<CreateTokenProps> = (
  props: CreateTokenProps
) => {
  const urlParams = new URLSearchParams(props.location.search);
  const typeWallet = urlParams.get('typeWallet');
  const { id } = props.match.params;
  const [activeTab, setActiveTab] = useState<string>(CREATE_DCT);
  const [
    IsCollateralAddressValid,
    setIsCollateralAddressValid,
  ] = useState<boolean>(true);
  const [formState, setFormState] = useState<CreateTokenFormState>({
    name: '',
    symbol: '',
    isDAT: false,
    decimal: '8',
    limit: '0',
    mintable: 'true',
    tradeable: 'true',
    receiveAddress: '',
    receiveLabel: '',
  });
  const [
    isConfirmationModalOpen,
    setIsConfirmationModalOpen,
  ] = useState<string>('default');
  const [wait, setWait] = useState<number>(5);
  const [allowCalls, setAllowCalls] = useState<boolean>(false);
  const [
    IsVerifyingCollateralModalOpen,
    setIsVerifyingCollateralModalOpen,
  ] = useState<boolean>(false);
  const [csvData, setCsvData] = React.useState<any>([]);

  const { fetchToken, tokenInfo } = props;

  useEffect(() => {
    fetchToken(id);
  }, [id]);

  const {
    createToken,
    updateToken,
    updatedTokenData,
    createdTokenData,
    isTokenCreating,
    isErrorCreatingToken,
    isTokenUpdating,
    isErrorUpdatingToken,
    paymentRequests,
    paymentRequestsLedger,
  } = props;

  useEffect(() => {
    if (!isEmpty(tokenInfo) && id) {
      const data: CreateTokenFormState = {
        name: tokenInfo.name,
        symbol: tokenInfo.symbol,
        isDAT: tokenInfo.isDAT,
        decimal: tokenInfo.decimal.toString(),
        limit: tokenInfo.limit.toString(),
        mintable: tokenInfo.mintable.toString(),
        tradeable: tokenInfo.tradeable.toString(),
        receiveAddress: (typeWallet ? paymentRequestsLedger : paymentRequests ?? [])[0]?.address,
        receiveLabel: (typeWallet ? paymentRequestsLedger : paymentRequests ?? [])[0]?.label,
      };
      setFormState(data);
    }
  }, [tokenInfo]);

  useEffect(() => {
    async function addressAndAmount() {
      let data;
      if (typeWallet === 'ledger') {
        data = await getReceivingAddressAndAmountListLedger(
          paymentRequestsLedger
        );
      } else {
        data = await getReceivingAddressAndAmountList();
      }
      setFormState({
        ...formState,
        receiveAddress:data.addressAndAmountList[0]?.address,
        receiveLabel: data.addressAndAmountList[0]?.label,
      });
    }
    addressAndAmount();
  }, []);

  useEffect(() => {
    if (allowCalls && !isTokenCreating) {
      if (!isErrorCreatingToken && !isEmpty(createdTokenData)) {
        setIsConfirmationModalOpen('success');
      }
      if (isErrorCreatingToken && isEmpty(createdTokenData)) {
        setIsConfirmationModalOpen('failure');
      }
    }
  }, [createdTokenData, isTokenCreating, isErrorCreatingToken, allowCalls]);

  useEffect(() => {
    if (allowCalls && !isTokenUpdating) {
      if (!isErrorUpdatingToken && !isEmpty(updatedTokenData)) {
        setIsConfirmationModalOpen('success');
      }
      if (isErrorUpdatingToken && isEmpty(updatedTokenData)) {
        setIsConfirmationModalOpen('failure');
      }
    }
  }, [updatedTokenData, isTokenUpdating, isErrorUpdatingToken, allowCalls]);

  useEffect(() => {
    let waitToSendInterval;
    if (isConfirmationModalOpen === 'confirm') {
      let counter = CONFIRM_BUTTON_COUNTER;
      waitToSendInterval = setInterval(() => {
        counter -= 1;
        setWait(counter);
        if (counter === 0) {
          clearInterval(waitToSendInterval);
        }
      }, CONFIRM_BUTTON_TIMEOUT);
    }
    return () => {
      clearInterval(waitToSendInterval);
    };
  }, [isConfirmationModalOpen]);

  const handleChange = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const handleDropDowns = (newData: any, amount: any) => {
    if (amount < MINIMUM_DFI_REQUIRED_FOR_TOKEN_CREATION) {
      setIsCollateralAddressValid(false);
    } else {
      setFormState({
        ...formState,
        ...newData,
        receiveAddress: newData.address,
        receiveLabel: newData.label,
      });
      setIsCollateralAddressValid(true);
    }
  };

  const handleActiveTab = (active: string) => {
    setActiveTab(active);
  };

  const createTokenData = () => {
    return { ...formState, collateralAddress: formState.receiveAddress };
  };

  const cancelConfirmation = () => {
    setWait(5);
    setIsConfirmationModalOpen('default');
  };

  const createConfirmation = () => {
    setAllowCalls(true);
    const tokenData = createTokenData();
    setIsConfirmationModalOpen('loading');
    createToken(tokenData, typeWallet as TypeWallet);
  };

  const updateConfirmation = () => {
    setAllowCalls(true);
    const tokenData = createTokenData();
    updateToken(tokenData, typeWallet as TypeWallet);
  };

  const handleSubmit = async () => {
    const tokenData = createTokenData();
    createToken(tokenData, typeWallet as TypeWallet);
  };

  return (
    <TabContent activeTab={activeTab}>
      <TabPane tabId={CREATE_DCT}>
        <div className='main-wrapper position-relative'>
          <CreateDCT
            isUpdate={!isEmpty(tokenInfo) && !!id}
            handleChange={handleChange}
            formState={formState}
            isErrorCreatingToken={isErrorCreatingToken}
            createdTokenData={createdTokenData}
            updatedTokenData={updatedTokenData}
            isErrorUpdatingToken={isErrorUpdatingToken}
            wait={wait}
            setWait={setWait}
            createConfirmation={createConfirmation}
            updateConfirmation={updateConfirmation}
            cancelConfirmation={cancelConfirmation}
            IsCollateralAddressValid={IsCollateralAddressValid}
            isConfirmationModalOpen={isConfirmationModalOpen}
            setIsConfirmationModalOpen={setIsConfirmationModalOpen}
            handleDropDowns={handleDropDowns}
            typeWallet={typeWallet}
          />
        </div>
      </TabPane>
      <TabPane tabId={DCT_DISTRIBUTION}>
        <div className='main-wrapper position-relative'>
          <DCTDistribution
            setIsVerifyingCollateralModalOpen={
              setIsVerifyingCollateralModalOpen
            }
            IsVerifyingCollateralModalOpen={IsVerifyingCollateralModalOpen}
            handleActiveTab={handleActiveTab}
            csvData={csvData}
            setCsvData={setCsvData}
            handleSubmit={handleSubmit}
          />
        </div>
      </TabPane>
    </TabContent>
  );
};

const mapStateToProps = (state) => {
  const { tokens, ledgerWallet, wallet } = state;
  return {
    tokenInfo: tokens.tokenInfo,
    isTokenCreating: tokens.isTokenCreating,
    createdTokenData: tokens.createdTokenData,
    isErrorCreatingToken: tokens.isErrorCreatingToken,
    isTokenUpdating: tokens.isTokenUpdating,
    updatedTokenData: tokens.updatedTokenData,
    isErrorUpdatingToken: tokens.isErrorUpdatingToken,
    paymentRequests: wallet.paymentRequests,
    paymentRequestsLedger: ledgerWallet.paymentRequests,
  };
};

const mapDispatchToProps = {
  fetchToken: (id) => fetchTokenInfo({ id }),
  createToken: (tokenData, typeWallet: TypeWallet) =>
    createToken({ tokenData, typeWallet }),
  updateToken: (tokenData, typeWallet: TypeWallet) =>
    updateTokenRequest({ tokenData, typeWallet }),
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateToken);
