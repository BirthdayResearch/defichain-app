import Enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

Enzyme.configure({ adapter: new Adapter() });

import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import PaymentRequestPage from '../components/PaymentRequestPage';
import { Provider } from 'react-redux';
import store from '../../../app/rootStore';
import { mount } from 'enzyme';
import {
  history,
  match,
  location,
} from '../../../utils/testUtils/routeComponentProps';

describe('PaymentRequestPage component', () => {
  it('should check for snapshot', () => {
    const wrapper = mount(
      <Router keyLength={0}>
        <Provider store={store}>
          <PaymentRequestPage
            history={history}
            location={location}
            match={match}
          />
        </Provider>
      </Router>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
