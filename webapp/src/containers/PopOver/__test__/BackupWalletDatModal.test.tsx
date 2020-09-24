import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import store from '../../../app/rootStore';
import BackupWalletDatModal from '../BackupWalletDatModal';

describe('BackupWalletDatModal', () => {
  it('should check for snapshot', () => {
    const wrapper = mount(
      <Provider store={store}>
        <BackupWalletDatModal />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
