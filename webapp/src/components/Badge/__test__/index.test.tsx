import React from 'react';
import Badge from '../index';
import { shallow } from 'enzyme';

describe('Badge component', () => {
  it('should check for snapshot', () => {
    const props = {
      baseClass: 'baseClass',
      label: 'label',
    };

    const wrapper = shallow(<Badge {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
