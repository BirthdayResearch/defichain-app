import React from 'react';
import CreateWallet from '../components/CreateWallet';
import * as routeComponentProps from '../../../utils/testUtils/routeComponentProps';
import { shallow } from 'enzyme';

describe('CreateWallet component', () => {
  it('should check for snapshot', () => {
    const wrapper = shallow(<CreateWallet {...routeComponentProps} />);
    expect(wrapper).toMatchSnapshot();
  });
});
