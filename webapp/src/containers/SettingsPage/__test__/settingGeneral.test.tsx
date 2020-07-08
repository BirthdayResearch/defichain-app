import React from 'react';
import SettingsTabGeneralComponent from '../components/SettingsTabGeneral';
import { shallow } from 'enzyme';

describe('SettingsTabGeneralComponent', () => {
  it('should check for snapshot', () => {
    const props = {
      launchAtLogin: true,
      minimizedAtLaunch: true,
      pruneBlockStorage: true,
      blockStorage: 12,
      databaseCache: 12,
      scriptVerificationThreads: 12,
      handleInputs: () => {},
      handleToggles: () => {},
    };
    const wrapper = shallow(<SettingsTabGeneralComponent {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
