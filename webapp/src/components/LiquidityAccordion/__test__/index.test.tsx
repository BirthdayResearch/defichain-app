import React from 'react';
import LiquidityAccordion from '../index';
import { shallow } from 'enzyme';
import { history } from '../../../utils/testUtils/routeComponentProps';

describe('LiquidityAccordion component', () => {
  it('should check for snapshot', () => {
    const props = {
      history: history,
      poolpair: [],
    };

    const wrapper = shallow(<LiquidityAccordion {...props} />);
    wrapper.find('Card').at(0).simulate('click');
    expect(wrapper).toMatchSnapshot();
  });
});
