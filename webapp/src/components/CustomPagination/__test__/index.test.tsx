import React from 'react';
import CustomPaginationComponent from '../index';
import { shallow } from 'enzyme';

describe('CustomPaginationComponent component', () => {
  it('should check for snapshot', () => {
    const props = {
      data: [],
      currentPage: 1,
      pagesCount: 1,
      label: 'label',
      handlePageClick: () => {},
      showNextOnly: true,
      disableNext: false,
      cancelToken: 1,
    };

    const wrapper = shallow(
      <CustomPaginationComponent
        data={props.data}
        currentPage={props.currentPage}
        pagesCount={props.pagesCount}
        label={props.label}
        handlePageClick={props.handlePageClick}
        showNextOnly={props.showNextOnly}
        disableNext={props.disableNext}
        cancelToken={props.cancelToken}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
