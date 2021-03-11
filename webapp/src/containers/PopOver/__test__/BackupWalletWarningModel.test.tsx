import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import store from '../../../app/rootStore';
import BackupWalletWarningModel from '../index';

describe('BackupWalletWarningModel', () => {
  it('should check for snapshot', () => {
    const wrapper = mount(
      <Provider store={store}>
        <BackupWalletWarningModel />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
