import React from 'react';
import WalletTokensList from '../index';
import { Provider } from 'react-redux';
import store from '../../../../../../app/rootStore';
import Enzyme from '../../../../../../utils/testUtils/enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import * as routeComponentProps from '../../../../../../utils/testUtils/routeComponentProps';

describe('WalletTokensList component', () => {
  it('should check for snapshot', () => {
    const wrapper = Enzyme.mount(
      <Router>
        <Provider store={store}>
          <WalletTokensList {...routeComponentProps} />
        </Provider>
      </Router>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
