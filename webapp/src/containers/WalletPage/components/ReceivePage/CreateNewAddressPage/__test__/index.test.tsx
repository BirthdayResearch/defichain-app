import React from 'react';
import CreateNewAddressPage from '../index';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import store from '../../../../../../app/rootStore';
import Enzyme from '../../../../../../utils/testUtils/enzyme';
import * as routeComponentProps from '../../../../../../utils/testUtils/routeComponentProps';

describe('CreateNewAddressPage component', () => {
  it('should check for snapshot', () => {
    const props = {
      paymentRequests: {
        label: '',
        id: '1',
        time: '',
        address: '',
        message: '',
        amount: 1,
        unit: '',
      },
      addReceiveTxns: () => {},
      history: routeComponentProps.history,
    };
    const wrapper = Enzyme.mount(
      <Router>
        <Provider store={store}>
          <CreateNewAddressPage {...routeComponentProps} {...props} />
        </Provider>
      </Router>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
