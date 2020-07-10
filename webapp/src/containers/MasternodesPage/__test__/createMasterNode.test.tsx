import React from 'react';
import CreateMasterNode from '../components/CreateMasterNode';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import store from '../../../app/rootStore';
import { mount } from 'enzyme';

describe('Create Master Node', () => {
  it('should check for snapshot', () => {
    const wrapper = mount(
      <Router>
        <Provider store={store}>
          <CreateMasterNode />
        </Provider>
      </Router>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
