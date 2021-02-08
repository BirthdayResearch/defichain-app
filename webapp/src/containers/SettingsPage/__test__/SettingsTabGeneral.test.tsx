import React from 'react';
import SettingsTabGeneral from '../components/SettingsTabGeneral';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import store from '../../../app/rootStore';

describe('SettingsTabGeneral', () => {
  it('should check for snapshot', () => {
    const props = {
      launchAtLogin: true,
      deletePeersAndBlocks: true,
      reindexAfterSaving: true,
      refreshUtxosAfterSaving: true,
      minimizedAtLaunch: true,
      pruneBlockStorage: true,
      blockStorage: 12,
      databaseCache: 12,
      maximumAmount: 1000,
      maximumCount: 650,
      feeRate: 0.1,
      scriptVerificationThreads: 12,
      handleRegularNumInputs: () => {},
      handleFractionalInputs: () => {},
      handleToggles: () => {},
      network: 'Testnet',
      networkOptions: [],
      handleDropDowns: () => {},
      openGeneralReIndexModal: () => {},
      handeReindexToggle: () => {},
      handeRefreshUtxosToggle: () => {},
    };
    const wrapper = shallow(
      <Provider store={store}>
        <SettingsTabGeneral {...props} />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
