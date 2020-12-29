import React from 'react';
import LiquidityInfo from '../components/LiquidityInfo';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../../../app/rootStore';
import Enzyme from '../../../utils/testUtils/enzyme';
import {
  history,
  location,
} from '../../../utils/testUtils/routeComponentProps';
const path = `/route/:id`;

describe('LiquidityInfo component', () => {
  it('should check for snapshot', () => {
    const wrapper = Enzyme.mount(
      <Router>
        <Provider store={store}>
          <LiquidityInfo
            match={{
              isExact: false,
              path,
              url: path.replace(':id', '1'),
              params: { poolID: '1' },
            }}
            history={history}
            location={location}
          />
        </Provider>
      </Router>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
