import React from 'react';
import CopyToClipboard from '../index';
import { shallow } from 'enzyme';

describe('CopyToClipboard component', () => {
  it('should check for snapshot', () => {
    const props = {
      value: 'value',
      size: 'size',
      link: 'link',
      class: 'class',
      handleCopy: () => {},
    };

    const wrapper = shallow(<CopyToClipboard {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
