import React from 'react';
import LaunchScreen from '../index';
import { shallow } from 'enzyme';

describe('LaunchScreen component', () => {
  it('should check for snapshot', () => {
    const props = {
      message: 'message',
      isLoading: true,
      isRestart: false,
    };

    const wrapper = shallow(<LaunchScreen {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
