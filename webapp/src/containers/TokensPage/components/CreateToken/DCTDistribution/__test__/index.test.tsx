import React from 'react';
import DCTDistribution from '../index';
import { Provider } from 'react-redux';
import store from '../../../../../../app/rootStore';
import Enzyme from '../../../../../../utils/testUtils/enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import * as routeComponentProps from '../../../../../../utils/testUtils/routeComponentProps';

describe('DCTDistribution component', () => {
  it('should check for snapshot', () => {
    const props = {
      handleActiveTab: () => {},
      csvData: [],
      setCsvData: () => {},
      handleSubmit: () => {},
      setIsVerifyingCollateralModalOpen: () => {},
      IsVerifyingCollateralModalOpen: true,
    };
    const wrapper = Enzyme.mount(
      <Router>
        <Provider store={store}>
          <DCTDistribution {...props} />
        </Provider>
      </Router>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
