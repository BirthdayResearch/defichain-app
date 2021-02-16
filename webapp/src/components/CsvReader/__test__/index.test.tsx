import React from 'react';
import CsvReader from '../index';
import { shallow } from 'enzyme';

describe('CsvReader component', () => {
  const props = {
    handleOnDrop: () => {},
    handleOnError: () => {},
    handleOnRemoveFile: () => {},
  };
  it('should check for snapshot', () => {
    const wrapper = shallow(<CsvReader {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
