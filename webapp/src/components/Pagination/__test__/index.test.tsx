import React from 'react';
import PaginationComponent from '../index';
import { shallow } from 'enzyme';

describe('PaginationComponent component', () => {
  it('should check for snapshot', () => {
    const props = {
      currentPage: 1,
      pagesCount: 10,
      label: 'label',
      handlePageClick: () => {},
      showNextOnly: true,
      disableNext: false,
    };
    const wrapper = shallow(<PaginationComponent {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
