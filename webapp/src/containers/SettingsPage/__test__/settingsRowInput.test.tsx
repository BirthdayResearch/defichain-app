import Enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

Enzyme.configure({ adapter: new Adapter() });

import React from 'react';
import SettingsRowInputComponent from '../components/SettingsRowInput';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import store from '../../../app/rootStore';

describe('SettingsRowInput', () => {
  it('should check for snapshot', () => {
    const props = {
      field: 'blockStorage',
      fieldName: 'blockStorage',
      label: 'blockPruneStorage',
      text: 'gb',
      name: 'pruneTo',
      id: 'pruneTo',
      placeholder: 'Number',
      handleInputs: () => {},
    };
    const wrapper = mount(
      <Provider store={store}>
        <SettingsRowInputComponent {...props} />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
