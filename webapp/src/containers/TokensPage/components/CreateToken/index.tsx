import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { TabContent, TabPane } from 'reactstrap';
import isEmpty from 'lodash/isEmpty';

import DCTDistribution from './DCTDistribution';
import CreateDCT from './CreateDCT';
import { createToken, fetchTokenInfo, updateToken } from '../../reducer';
import { getReceivingAddressAndAmountList } from '../../service';
import {
  CONFIRM_BUTTON_COUNTER,
  CONFIRM_BUTTON_TIMEOUT,
  CREATE_DCT,
  DCT_DISTRIBUTION,
  MINIMUM_DFI_REQUIRED_FOR_TOKEN_CREATION,
} from '../../../../constants';
import { ITokenResponse } from '../../../../utils/interfaces';

interface RouteParams {
  id?: string;
}

interface CreateTokenProps extends RouteComponentProps<RouteParams> {
  tokenInfo: any;
  fetchToken: (id: string | undefined) => void;
  createToken: (tokenData) => void;
  updateToken: (tokenData) => void;
  createdTokenData: ITokenResponse;
  updatedTokenData: ITokenResponse;
  isTokenUpdating: boolean;
  isErrorUpdatingToken: string;
  isTokenCreating: boolean;
  isErrorCreatingToken: string;
}

const CreateToken: React.FunctionComponent<CreateTokenProps> = (
  props: CreateTokenProps
) => {
  const { id } = props.match.params;
  const [collateralAddresses, setCollateralAddresses] = useState<any>([]);
  const [activeTab, setActiveTab] = useState<string>(CREATE_DCT);
  const [IsCollateralAddressValid, setIsCollateralAddressValid] = useState<
    boolean
  >(true);
  const [formState, setFormState] = useState<any>({
    name: '',
    symbol: '',
    isDAT: false,
    decimal: '8',
    limit: '0',
    mintable: 'true',
    tradeable: 'true',
    collateralAddress: '',
  });
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState<
    string
  >('default');
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
  }, []);

  useEffect(() => {
    if (!isEmpty(tokenInfo) && id) {
      const data = {
        name: tokenInfo.name,
        symbol: tokenInfo.symbol,
        isDAT: tokenInfo.isDAT,
        decimal: tokenInfo.decimal.toString(),
        limit: tokenInfo.limit.toString(),
        mintable: tokenInfo.mintable.toString(),
        tradeable: tokenInfo.tradeable.toString(),
      };
      setFormState(data);
    }
  }, [tokenInfo]);

  const {
    createToken,
    updateToken,
    updatedTokenData,
    createdTokenData,
    isTokenCreating,
    isErrorCreatingToken,
    isTokenUpdating,
    isErrorUpdatingToken,
  } = props;

  useEffect(() => {
    async function addressAndAmount() {
      const data = await getReceivingAddressAndAmountList();
      setCollateralAddresses(data.addressAndAmountList);
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

  const handleDropDowns = (data: any, field: any, amount: any) => {
    if (amount < MINIMUM_DFI_REQUIRED_FOR_TOKEN_CREATION) {
      setIsCollateralAddressValid(false);
    } else {
      setFormState({
        ...formState,
        [field]: data,
      });
      setIsCollateralAddressValid(true);
    }
  };

  const handleActiveTab = (active: string) => {
    setActiveTab(active);
  };

  const cancelConfirmation = () => {
    setWait(5);
    setIsConfirmationModalOpen('default');
  };

  const createConfirmation = () => {
    setAllowCalls(true);
    const tokenData = { ...formState };
    createToken(tokenData);
  };

  const updateConfirmation = () => {
    setAllowCalls(true);
    const tokenData = { ...formState };
    updateToken(tokenData);
  };

  const handleSubmit = async () => {
    const tokenData = { ...formState };
    createToken(tokenData);
  };

  return (
    <TabContent activeTab={activeTab}>
      <TabPane tabId={CREATE_DCT}>
        <div className='main-wrapper position-relative'>
          <CreateDCT
            isUpdate={!isEmpty(tokenInfo) && !!id}
            handleChange={handleChange}
            formState={formState}
            collateralAddresses={collateralAddresses}
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
  const { tokens } = state;
  return {
    tokenInfo: tokens.tokenInfo,
    isTokenCreating: tokens.isTokenCreating,
    createdTokenData: tokens.createdTokenData,
    isErrorCreatingToken: tokens.isErrorCreatingToken,
    isTokenUpdating: tokens.isTokenUpdating,
    updatedTokenData: tokens.updatedTokenData,
    isErrorUpdatingToken: tokens.isErrorUpdatingToken,
  };
};

const mapDispatchToProps = {
  fetchToken: (id) => fetchTokenInfo({ id }),
  createToken: (tokenData) => createToken({ tokenData }),
  updateToken: (tokenData) => updateToken({ tokenData }),
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateToken);
