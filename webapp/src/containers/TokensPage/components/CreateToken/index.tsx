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
  TOKENS_PATH,
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
    if (!isTokenCreating) {
      if (!isErrorCreatingToken && !isEmpty(createdTokenData)) {
        setIsVerifyingCollateralModalOpen(false);
      }
      if (isErrorCreatingToken && isEmpty(createdTokenData)) {
        setIsVerifyingCollateralModalOpen(false);
      }
    }
  }, [createdTokenData, isTokenCreating, isErrorCreatingToken]);

  const handleSubmit = async () => {
    const tokenData = { ...formState };
    createToken(tokenData);
  };

  const handleChange = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const handleDropDowns = (data: any, field: any) => {
    setFormState({
      ...formState,
      [field]: data,
    });
  };

  const handleActiveTab = (active: string) => {
    setActiveTab(active);
  };

  return (
    <TabContent activeTab={activeTab}>
      <TabPane tabId={CREATE_DCT}>
        <div className='main-wrapper position-relative'>
          <CreateDCT
            handleActiveTab={handleActiveTab}
            handleChange={handleChange}
            formState={formState}
            collateralAddresses={collateralAddresses}
            setIsVerifyingCollateralModalOpen={
              setIsVerifyingCollateralModalOpen
            }
            IsVerifyingCollateralModalOpen={IsVerifyingCollateralModalOpen}
            handleSubmit={handleSubmit}
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
