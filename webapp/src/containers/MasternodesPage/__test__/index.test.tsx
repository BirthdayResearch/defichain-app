import React from 'react';
import Masternode from '../index';
import { shallow } from 'enzyme';
import * as routeComponentProps from '../../../utils/testUtils/routeComponentProps';

describe('Map Chart', () => {
  it('should check for snapshot', () => {
    const wrapper = shallow(<Masternode {...routeComponentProps} />);
    expect(wrapper).toMatchSnapshot();
  });
});
