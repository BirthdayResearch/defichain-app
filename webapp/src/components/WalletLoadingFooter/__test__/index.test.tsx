import React from 'react';
import WalletLoadingFooter from '../index';
import { shallow } from 'enzyme';

describe('WalletLoadingFooter component', () => {
  it('should check for snapshot', () => {
    const props = {
      message: 'message',
    };
    const wrapper = shallow(<WalletLoadingFooter {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
