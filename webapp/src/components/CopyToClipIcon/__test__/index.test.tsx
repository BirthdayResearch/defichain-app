import React from 'react';
import CopyToClipIcon from '../index';
import { shallow } from 'enzyme';

describe('CopyToClipIcon component', () => {
  it('should check for snapshot', () => {
    const props = {
      value: 'value',
      uid: 'uid',
      className: 'className',
      handleCopyFunction: () => {},
    };

    const wrapper = shallow(<CopyToClipIcon {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
