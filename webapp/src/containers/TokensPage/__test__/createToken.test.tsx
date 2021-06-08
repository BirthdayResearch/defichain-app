import React from 'react';
import CreateToken from '../components/CreateToken';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import store from '../../../app/rootStore';
import { match } from 'react-router';
import * as routeComponentProps from '../../../utils/testUtils/routeComponentProps';

describe('Create token page', () => {
  it('should check for snapshot', () => {
    const path = `/route/:hash`;
    const match: match<{ hash: string }> = {
      isExact: false,
      path,
      url: path.replace(':hash', '1'),
      params: { hash: '1' },
    };
    const ITokenResponse = {
      hash: 'hash',
    };
    const PaymentRequestModel = {
      label: 'label',
      id: '12',
      time: 'time',
      address: 'address',
      message: 'message',
      amount: '123',
      unit: '1',
      hdSeed: true,
    };
    const props = {
      tokenInfo: {},
      fetchToken: () => {},
      createToken: () => {},
      updateToken: () => {},
      createdTokenData: ITokenResponse,
      updatedTokenData: ITokenResponse,
      isTokenUpdating: true,
      isErrorUpdatingToken: 'isErrorUpdatingToken',
      isTokenCreating: true,
      isErrorCreatingToken: 'isErrorCreatingToken',
      paymentRequests: PaymentRequestModel,
      match: match,
    };
    const wrapper = shallow(
      <Provider store={store}>
        <CreateToken {...props} {...routeComponentProps} />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
