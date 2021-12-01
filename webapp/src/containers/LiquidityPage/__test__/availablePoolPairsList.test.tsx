import React from 'react';
import AvailablePoolPairsList from '../components/AvailablePoolPairsList';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../../../app/rootStore';
import Enzyme from '../../../utils/testUtils/enzyme';

describe('AvailablePoolPairsList component', () => {
  it('should check for snapshot', () => {
    const wrapper = Enzyme.mount(
      <Router>
        <Provider store={store}>
          <AvailablePoolPairsList searchQuery={''} poolPairList={[]} poolshares={[]} />
        </Provider>
      </Router>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
