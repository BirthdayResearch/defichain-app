import React from 'react';
import SettingsRowToggleComponent from '../components/SettingsRowToggle';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import store from '../../../app/rootStore';

describe('SettingsRowInput', () => {
  it('should check for snapshot', () => {
    const props = {
      field: 'blockStorage',
      fieldName: 'blockStorage',
      label: 'blockPruneStorage',
      hideMinimized: 'settings',
      handleToggles: () => {},
    };
    const wrapper = mount(
      <Provider store={store}>
        <SettingsRowToggleComponent {...props} />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
