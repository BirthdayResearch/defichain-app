import React from 'react';
import SendPage from '../components/SendPage/index';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../../../app/rootStore';
import Enzyme from '../../../utils/testUtils/enzyme';
import { location } from '../../../utils/testUtils/routeComponentProps';

describe('SendPage component', () => {
  it('should check for snapshot', () => {
    const props = {
      unit: '123',
      location: location,
      sendData: {
        walletBalance: 123,
        amountToSend: 'amountToSend',
        amountToSendDisplayed: 'amountToSendDisplayed',
        toAddress: 'toAddress',
        scannerOpen: true,
        flashed: 'flashed',
        showBackdrop: 'showBackdrop',
        sendStep: 'sendStep',
        waitToSend: 1,
      },
      fetchSendDataRequest: () => {},
    };
    const wrapper = Enzyme.mount(
      <Router>
        <Provider store={store}>
          <SendPage {...props} />
        </Provider>
      </Router>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
