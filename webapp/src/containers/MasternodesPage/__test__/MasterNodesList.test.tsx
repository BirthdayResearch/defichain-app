import React from 'react';
import MasternodesList from '../index';
import { Provider } from 'react-redux';
import store from '../../../app/rootStore';
import Enzyme from '../../../utils/testUtils/enzyme';
import { BrowserRouter as Router } from 'react-router-dom';

describe('MasternodesList component', () => {
  it('should check for snapshot', () => {
    const wrapper = Enzyme.mount(
      <Router>
        <Provider store={store}>
          <MasternodesList />
        </Provider>
      </Router>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
