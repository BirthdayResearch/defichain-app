import React from 'react';
import SettingsRowDropDownComponent from '../components/SettingsRowDropDown';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import store from '../../../app/rootStore';
import { settingsRowDropDown } from './testData.json';

describe('SettingsRowDropDownComponent', () => {
  it('should check for snapshot', () => {
    const props = {
      label: 'containers.settings.displayMode',
      data: settingsRowDropDown.languages,
      field: settingsRowDropDown.language,
      handleDropDowns: () => {},
      fieldName: 'language',
    };
    const wrapper = shallow(
      <Provider store={store}>
        <SettingsRowDropDownComponent {...props} />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
