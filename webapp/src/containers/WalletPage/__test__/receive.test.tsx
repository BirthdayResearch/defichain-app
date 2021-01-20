import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import {
  history,
  location,
  match,
} from '../../../utils/testUtils/routeComponentProps';
import ReceivePage from '../components/ReceivePage';
import { Provider } from 'react-redux';
import store from '../../../app/rootStore';
import Enzyme from '../../../utils/testUtils/enzyme';

describe('ReceivePage component', () => {
  it('should check for snapshot', () => {
    const wrapper = Enzyme.mount(
      <Router>
        <Provider store={store}>
          <ReceivePage history={history} location={location} match={match} />
        </Provider>
      </Router>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
