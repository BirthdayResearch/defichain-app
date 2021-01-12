import React from 'react';
import { Provider } from 'react-redux';
import store from '../../../app/rootStore';
import Enzyme from '../../../utils/testUtils/enzyme';
import BackupWalletDatModal from '../BackupWalletDatModal';

describe('BackupWalletDatModal', () => {
  it('should check for snapshot', () => {
    const wrapper = Enzyme.mount(
      <Provider store={store}>
        <BackupWalletDatModal />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
