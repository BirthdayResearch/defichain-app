import React from 'react';
import ValueLi from '../ValueLi/index';
import { shallow } from 'enzyme';

describe('ValueLi component', () => {
  it('should check for snapshot', () => {
    const props = {
      copyable: '',
      value: 'value',
      popsQR: 'popsQR',
      uid: 'uid',
      label: 'label',
    };

    const wrapper = shallow(<ValueLi {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
