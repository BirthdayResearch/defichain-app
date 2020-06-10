import React from 'react';
import { shallow } from 'enzyme';
import ReferenceComponent from '../ReferenceComponent';
import { referenceComponentProps } from './testData.json';

describe('ReferenceComponent ', () => {
  it('should check for snapshot', () => {
    const props = referenceComponentProps;
    const wrapper = shallow(<ReferenceComponent {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
