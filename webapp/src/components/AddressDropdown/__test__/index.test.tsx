import React from 'react';
import AddressDropdown from '../index';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import store from '../../../app/rootStore';
import { PaymentRequestModel } from '../../../containers/WalletPage/components/ReceivePage/CreateNewAddressPage';

describe('AddressDropdown ', () => {
  it('should check for snapshot', () => {
    const props = {
      formState: {
        receiveAddress: 'receiveAddress',
        receiveLabel: 'receiveLabel',
      },
      paymentRequests: {
        label: 'label',
        id: 'id',
        time: 'time',
        address: 'address',
        message: 'message',
        amount: 1,
        unit: 'unit',
        hdSeed: true,
      },
      isDisabled: true,
      additionalClass: () => '',
      getTransactionLabel: () => '',
      onSelectAddress: () => {},
    };
    const wrapper = shallow(
      <Provider store={store}>
        {/* <AddressDropdown
          formState={props.formState}
          paymentRequests={[paymentRequests]}
          isDisabled={props.isDisabled}
          additionalClass={props.additionalClass}
          getTransactionLabel={props.getTransactionLabel}
          onSelectAddress={props.onSelectAddress}
        /> */}
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
