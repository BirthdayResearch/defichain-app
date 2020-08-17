import React from 'react';
import PaymentRequestList from '../components/ReceivePage/PaymentRequestList';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../../../app/rootStore';
import { mount } from 'enzyme';

describe('PaymentRequests component', () => {
  it('should check for snapshot', () => {
    const wrapper = mount(
      <Router>
        <Provider store={store}>
          <PaymentRequestList />
        </Provider>
      </Router>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
