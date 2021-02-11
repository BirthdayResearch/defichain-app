import React from 'react';
import ViewOnChain from '../index';
import { shallow } from 'enzyme';

describe('ViewOnChain component', () => {
  it('should check for snapshot', () => {
    const props = {
      txid: '',
    };
    const wrapper = shallow(<ViewOnChain {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
