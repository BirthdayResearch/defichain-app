import React from 'react';
import { Provider } from 'react-redux';
import store from '../../../app/rootStore';
import PostUpdateComponent from '../UpdateProgress/PostUpdateComponent';
import Enzyme from '../../../utils/testUtils/enzyme';

describe('PostUpdateComponent', () => {
  it('should check for snapshot', () => {
    const wrapper = Enzyme.mount(
      <Provider store={store}>
        <PostUpdateComponent closeModal={() => {}} />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
