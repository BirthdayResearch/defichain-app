import React from 'react';
import SettingsTabHeader from '../components/SettingsTabHeader';
import { shallow } from 'enzyme';

describe('SettingsTabHeader', () => {
  const props = {
    setActiveTab: () => {},
    activeTab: 'Active',
  };
  it('should check for snapshot if isUnsaved is true', () => {
    const wrapper = shallow(<SettingsTabHeader {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
