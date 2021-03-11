import React from 'react';
import SettingsTabComponent from '../components/SettingsTab';
import Enzyme from '../../../utils/testUtils/enzyme';
import { Provider } from 'react-redux';
import store from '../../../app/rootStore';
import { settingTab } from './testData.json';

describe('SettingsTabComponent', () => {
  it('should check for snapshot', () => {
    const props = {
      ...settingTab,
      handleDropDowns: () => {},
      handleToggles: () => {},
    };
    const wrapper = Enzyme.mount(
      <Provider store={store}>
        <SettingsTabComponent {...props} />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
