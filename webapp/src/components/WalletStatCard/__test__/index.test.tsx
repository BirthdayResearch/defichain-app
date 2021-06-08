import React from 'react';
import WalletStatCard from '../index';
import { shallow } from 'enzyme';

describe('WalletStatCard component', () => {
  it('should check for snapshot', () => {
    const props = {
      label: 'label',
      icon: 'icon',
    };
    const wrapper = shallow(<WalletStatCard {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
