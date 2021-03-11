import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import SendPage from '../components/SendPage';
import { Provider } from 'react-redux';
import store from '../../../app/rootStore';
import { mount } from 'enzyme';

describe('SendPage component', () => {
  it('should check for snapshot', () => {
    // const wrapper = mount(
    //   <Router>
    //     <Provider store={store}>
    //       <SendPage />
    //     </Provider>
    //   </Router>
    // );
    // expect(wrapper).toMatchSnapshot();
  });
});
