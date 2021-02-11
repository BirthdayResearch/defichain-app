import Enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

Enzyme.configure({ adapter: new Adapter() });
import React from 'react';
import RemoveLiquidity from '../components/RemoveLiquidity';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../../../app/rootStore';
import { mount } from 'enzyme';
import {
  history,
  match,
  location,
} from '../../../utils/testUtils/routeComponentProps';

describe('RemoveLiquidity component', () => {
  it('should check for snapshot', () => {
    const wrapper = mount(
      <Router>
        <Provider store={store}>
          <RemoveLiquidity
            history={history}
            location={location}
            match={match}
          />
        </Provider>
      </Router>
    );

    wrapper.find('Button').at(0).simulate('click');
    const event = { target: { name: 'decimal', value: 1 } };
    wrapper.find('Input').at(0).simulate('change', event);
    wrapper.find('span').at(2).simulate('click');
    const event1 = { target: { name: 'removeLiquidityRange', value: 0 } };
    wrapper.find('CustomInput').at(0).simulate('change', event1);
    wrapper.find('span').at(3).simulate('click');
    expect(wrapper).toMatchSnapshot();
  });
});
