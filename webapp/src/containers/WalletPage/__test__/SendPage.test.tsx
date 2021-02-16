import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import SendPage from '../components/SendPage';
import { Provider } from 'react-redux';
import store from '../../../app/rootStore';
import { mount } from 'enzyme';
import * as routeComponentProps from '../../../utils/testUtils/routeComponentProps';

describe('SendPage component', () => {
  it('should check for snapshot', () => {
    const props = {
      unit: '',
      sendData: {
        walletBalance: 1,
        amountToSend: 1,
        amountToSendDisplayed: 1,
        toAddress: '',
        scannerOpen: false,
        flashed: '',
        showBackdrop: '',
        sendStep: '',
        waitToSend: 1,
      },
      fetchSendDataRequest: () => {},
    };
    const wrapper = mount(
      <Router>
        <Provider store={store}>
          <SendPage {...routeComponentProps} {...props} />
        </Provider>
      </Router>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
