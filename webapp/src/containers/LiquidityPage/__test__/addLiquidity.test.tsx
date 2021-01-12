import React from 'react';
import AddLiquidity from '../components/AddLiquidity';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../../../app/rootStore';
import Enzyme from '../../../utils/testUtils/enzyme';
import { location } from '../../../utils/testUtils/routeComponentProps';

describe('AddLiquidity component', () => {
  it('should check for snapshot', () => {
    const wrapper = Enzyme.mount(
      <Router>
        <Provider store={store}>
          <AddLiquidity location={location} />
        </Provider>
      </Router>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
