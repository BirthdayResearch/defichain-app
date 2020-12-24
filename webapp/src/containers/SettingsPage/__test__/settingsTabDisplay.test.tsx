import React from 'react';
import SettingsTabDisplayComponent from '../components/SettingsTabDisplay';
import Enzyme from '../../../utils/testUtils/enzyme';
import { Provider } from 'react-redux';
import store from '../../../app/rootStore';
import { settingTabDisplay } from './testData.json';

describe('SettingsTabDisplayComponent', () => {
  it('should check for snapshot', () => {
    const props = {
      ...settingTabDisplay,
      handleDropDowns: () => {},
    };
    const wrapper = Enzyme.mount(
      <Provider store={store}>
        <SettingsTabDisplayComponent {...props} />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
