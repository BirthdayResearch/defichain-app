import React from 'react';
import Footer from '../index';
import { shallow } from 'enzyme';
import * as routeComponentProps from '../../../../../../../utils/testUtils/routeComponentProps';

describe('Footer component', () => {
  it('should check for snapshot', () => {
    const props = {
      isUpdate: true,
      formState: {
        tokenInfo: [],
        fetchToken: () => {},
        createToken: () => {},
        updateToken: () => {},
        createdTokenData: {
          hash: '',
        },
        updatedTokenData: {
          hash: '',
        },
        isTokenUpdating: true,
        isErrorUpdatingToken: '',
        isTokenCreating: true,
        isErrorCreatingToken: '',
        paymentRequests: {
          label: '',
          id: '',
          time: '',
          address: '',
          message: '',
          amount: 1,
          unit: '',
          hdSeed: true,
        },
        receiveAddress: '',
        receiveLabel: '',
      },
      isConfirmationModalOpen: '',
      setIsConfirmationModalOpen: () => {},
      cancelConfirmation: () => {},
      createConfirmation: () => {},
      updateConfirmation: () => {},
      wait: 1,
      createdTokenData: {
        hash: '',
      },
      isErrorCreatingToken: '',
      isErrorUpdatingToken: '',
      updatedTokenData: {
        hash: '',
      },
      IsCollateralAddressValid: true,
    };

    const wrapper = shallow(<Footer {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
