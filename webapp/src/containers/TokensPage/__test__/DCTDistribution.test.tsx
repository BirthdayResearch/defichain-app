import React from 'react';
import DCTDistribution from '../components/CreateToken/DCTDistribution';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import store from '../../../app/rootStore';

import * as routeComponentProps from '../../../utils/testUtils/routeComponentProps';

describe('DCTDistribution token page', () => {
  it('should check for snapshot', () => {
    const props = {
      handleActiveTab: () => {},
      setCsvData: () => {},
      csvData: [],
      handleSubmit: () => {},
      IsVerifyingCollateralModalOpen: false,
      setIsVerifyingCollateralModalOpen: () => {},
    };
    const wrapper = shallow(
      <Provider store={store}>
        <DCTDistribution {...props} />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
