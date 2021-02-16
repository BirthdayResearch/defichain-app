import React from 'react';
import CopyToClipIcon from '../index';
import { shallow } from 'enzyme';

describe('CopyToClipIcon component', () => {
  it('should check for snapshot', () => {
    const props = {
      copyable: 'copyable',
      value: 'value',
      popsQR: 'popsQR',
      uid: 'uid',
      label: 'label',
    };

    const wrapper = shallow(<CopyToClipIcon {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
