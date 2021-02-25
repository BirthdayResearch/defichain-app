import React from 'react';
import CreateWallet from '../components/CreateWallet';
import * as routeComponentProps from '../../../utils/testUtils/routeComponentProps';
import { Provider } from 'react-redux';
import store from '../../../app/rootStore';
import { BrowserRouter as Router } from 'react-router-dom';
import Enzyme from '../../../utils/testUtils/enzyme';

describe('CreateWallet component', () => {
  it('should check for snapshot', () => {
    const wrapper = Enzyme.mount(
      <Router>
        <Provider store={store}>
          <CreateWallet {...routeComponentProps} />
        </Provider>
      </Router>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
