import React from 'react';
import RestoreWallet from '../components/RestoreWallet/index';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../../../app/rootStore';
import Enzyme from '../../../utils/testUtils/enzyme';
import * as routeComponentProps from '../../../utils/testUtils/routeComponentProps';

describe('RestoreWallet component', () => {
  it('should check for snapshot', () => {
    const wrapper = Enzyme.mount(
      <Router>
        <Provider store={store}>
          <RestoreWallet {...routeComponentProps} />
        </Provider>
      </Router>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
