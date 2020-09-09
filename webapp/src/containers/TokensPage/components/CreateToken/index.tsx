import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { TabContent, TabPane } from 'reactstrap';
import isEmpty from 'lodash/isEmpty';

import DCTDistribution from './DCTDistribution';
import CreateDCT from './CreateDCT';
import { createToken } from '../../reducer';
import { getReceivingAddressAndAmountList } from '../../service';
import {
  CREATE_DCT,
  DCT_DISTRIBUTION,
  MINIMUM_DFI_REQUIRED_FOR_TOKEN_CREATION,
} from '../../../../constants';

interface CreateTokenProps extends RouteComponentProps {
  createToken: (tokenData) => void;
  createdTokenData: any;
  isTokenCreating: boolean;
  isErrorCreatingToken: boolean;
}

const CreateToken: React.FunctionComponent<CreateTokenProps> = (
  props: CreateTokenProps
) => {
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

  const {
    createToken,
    createdTokenData,
    isTokenCreating,
    isErrorCreatingToken,
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
    let waitToSendInterval;
    if (isConfirmationModalOpen === 'confirm') {
      let counter = 5;
      waitToSendInterval = setInterval(() => {
        counter -= 1;
        setWait(counter);
        if (counter === 0) {
          clearInterval(waitToSendInterval);
        }
      }, 1000);
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

  const confirmation = () => {
    setAllowCalls(true);
    const tokenData = { ...formState };
    createToken(tokenData);
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
            handleChange={handleChange}
            formState={formState}
            collateralAddresses={collateralAddresses}
            isErrorCreatingToken={isErrorCreatingToken}
            createdTokenData={createdTokenData}
            wait={wait}
            setWait={setWait}
            confirmation={confirmation}
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
    isTokenCreating: tokens.isTokenCreating,
    createdTokenData: tokens.createdTokenData,
    isErrorCreatingToken: tokens.isErrorCreatingToken,
  };
};

const mapDispatchToProps = {
  createToken: (tokenData) => createToken({ tokenData }),
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateToken);
