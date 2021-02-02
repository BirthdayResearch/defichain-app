import React from 'react';
import CreateDCT from '../index';
import { Provider } from 'react-redux';
import store from '../../../../../../app/rootStore';
import Enzyme from '../../../../../../utils/testUtils/enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import * as routeComponentProps from '../../../../../../utils/testUtils/routeComponentProps';

describe('CreateDCT component', () => {
  it('should check for snapshot', () => {
    const props = {
      handleChange: () => {},
      formState: {
        name: '',
        symbol: '',
        isDAT: false,
        decimal: '8',
        limit: '0',
        mintable: 'true',
        tradeable: 'true',
        receiveAddress: '',
        receiveLabel: '',
      },
      IsCollateralAddressValid: true,
      isConfirmationModalOpen: '',
      setIsConfirmationModalOpen: () => {},
      createdTokenData: {
        hash: '',
      },
      updatedTokenData: {
        hash: '',
      },
      wait: 1,
      setWait: () => {},
      createConfirmation: () => {},
      updateConfirmation: () => {},
      handleDropDowns: () => {},
      cancelConfirmation: () => {},
      isErrorCreatingToken: '',
      isErrorUpdatingToken: '',
      isUpdate: true,
    };
    const wrapper = Enzyme.mount(
      <Router>
        <Provider store={store}>
          <CreateDCT {...props} />
        </Provider>
      </Router>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
