import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import store from '../../../app/rootStore';
import DownloadProgressComponent from '../UpdateProgress/DownloadProgressComponent';

describe('DownloadProgressComponent', () => {
  it('should check for snapshot', () => {
    const wrapper = mount(
      <Provider store={store}>
        <DownloadProgressComponent />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
