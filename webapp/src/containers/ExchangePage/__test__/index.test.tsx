import React from 'react';
import { shallow } from 'enzyme';
import ExchangePage from '../index';

describe('ExchangePage Page', () => {
  it('should check for snapshot', () => {
    const wrapper = shallow(<ExchangePage />);
    expect(wrapper).toMatchSnapshot();
  });
});
