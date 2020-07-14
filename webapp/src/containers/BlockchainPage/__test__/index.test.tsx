import React from 'react';
import BlockchainPage from '../index';
import { shallow } from 'enzyme';

describe('BlockChainPage component', () => {
  it('should check for snapshot', () => {
    const wrapper = shallow(<BlockchainPage />);
    expect(wrapper).toMatchSnapshot();
  });
});
