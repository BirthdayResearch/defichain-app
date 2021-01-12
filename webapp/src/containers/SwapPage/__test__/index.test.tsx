import React from 'react';
import SwapPage from '../index';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import store from '../../../app/rootStore';
import Enzyme from '../../../utils/testUtils/enzyme';
import {
  history,
  location,
} from '../../../utils/testUtils/routeComponentProps';

describe('SwapPage component', () => {
  it('should check for snapshot', () => {
    const wrapper = Enzyme.mount(
      <Router>
        <Provider store={store}>
          <SwapPage
            history={history}
            location={location}
            isErrorAddingPoolLiquidity={''}
          />
        </Provider>
      </Router>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
