import React from 'react';
import { shallow } from 'enzyme';
import HelpPage from '../index';
import * as routeComponentProps from '../../../utils/testUtils/routeComponentProps';

describe('HelpPage Page', () => {
  it('should check for snapshot', () => {
    const wrapper = shallow(<HelpPage {...routeComponentProps} />);
    expect(wrapper).toMatchSnapshot();
  });
});
