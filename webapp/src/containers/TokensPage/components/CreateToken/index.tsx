import React, { useState } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { TabContent, TabPane } from 'reactstrap';

import DCTDistribution from './DCTDistribution';
import CreateDCT from './CreateDCT';
import { createToken } from '../../reducer';
import { CREATE_DCT, DCT_DISTRIBUTION } from '../../../../constants';

interface CreateTokenProps extends RouteComponentProps {
  createToken: (tokenData) => void;
}

const CreateToken: React.FunctionComponent<CreateTokenProps> = (
  props: CreateTokenProps
) => {
  const [activeTab, setActiveTab] = useState<string>(CREATE_DCT);
  const [formState, setFormState] = useState<any>({
    nameLabel: '',
    tickerSymbol: '',
    divisibility: '8',
    initialSupply: '',
    mintingSupport: 'no',
    optionalFinalSupplyLimit: '',
    tradable: 'no',
  });
  const [csvData, setCsvData] = React.useState<any>([]);

  const { createToken } = props;

  const handleSubmit = () => {
    const tokenData = { ...formState, collateralAddresses: csvData };
    createToken(tokenData);
  };

  const handleChange = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
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
          />
        </div>
      </TabPane>
      <TabPane tabId={DCT_DISTRIBUTION}>
        <div className='main-wrapper position-relative'>
          <DCTDistribution
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
