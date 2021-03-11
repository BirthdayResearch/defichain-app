import React from 'react';
import { Provider } from 'react-redux';
import store from '../../../app/rootStore';
import DownloadProgressComponent from '../UpdateProgress/DownloadProgressComponent';
import Enzyme from '../../../utils/testUtils/enzyme';

describe('DownloadProgressComponent', () => {
  it('should check for snapshot', () => {
    const wrapper = Enzyme.mount(
      <Provider store={store}>
        <DownloadProgressComponent />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
