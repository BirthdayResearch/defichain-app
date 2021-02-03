import React from 'react';
import VerifyMnemonic from '../components/CreateWallet/VerifyMnemonic';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../../../app/rootStore';
import Enzyme from '../../../utils/testUtils/enzyme';
import { createMemoryHistory, createLocation } from 'history';
const history = createMemoryHistory();

describe('VerifyMnemonic component', () => {
  const props = {
    mnemonicObj: {},
    finalMixObj: {},
    mnemonicCode:
      'cup ivory glow execute parrot viable genius ripple upper humor meat nut purse scatter cabbage again favorite doctor citizen pig write muffin daring dumb ',
    isWalletTabActive: false,
    isWalletCreating: false,
    isErrorCreatingWallet: '',
    history: history,
    setIsWalletTabActive: () => {},
    createWallet: () => {},
    resetCreateWalletError: () => {},
  };
  it('should check for snapshot', () => {
    const wrapper = Enzyme.mount(
      <Router>
        <Provider store={store}>
          {/* <VerifyMnemonic {...routeComponentProps} {...props} /> */}
        </Provider>
      </Router>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
