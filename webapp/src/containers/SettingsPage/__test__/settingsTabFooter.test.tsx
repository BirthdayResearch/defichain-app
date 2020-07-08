import React from 'react';
import SettingsTabFooterComponent from '../components/SettingsTabFooter';
import { shallow } from 'enzyme';

describe('SettingsTabFooterComponent', () => {
  it('should check for snapshot if isUnsaved is true', () => {
    const props = {
      saveChanges: () => {},
      isUnsavedChanges: true,
    };
    const wrapper = shallow(<SettingsTabFooterComponent {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
  it('should check for snapshot if isUnsaved is true', () => {
    const props = {
      saveChanges: () => {},
      isUnsavedChanges: false,
    };
    const wrapper = shallow(<SettingsTabFooterComponent {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
