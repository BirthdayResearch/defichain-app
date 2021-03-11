import React from 'react';
import StatisticsTab from '../index';
import { Provider } from 'react-redux';
import store from '../../../app/rootStore';
import Enzyme from '../../../utils/testUtils/enzyme';
import { BrowserRouter as Router } from 'react-router-dom';

describe('StatisticsTab component', () => {
  it('should check for snapshot', () => {
    const wrapper = Enzyme.mount(
      <Router>
        <Provider store={store}>
          <StatisticsTab />
        </Provider>
      </Router>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
