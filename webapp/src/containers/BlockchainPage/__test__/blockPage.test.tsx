import Enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

Enzyme.configure({ adapter: new Adapter() });

import React from 'react';
import BlockPage from '../components/BlockPage';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';
import {
  history,
  match,
  location,
} from '../../../utils/testUtils/routeComponentProps';
import store from '../../../app/rootStore';
import { mount } from 'enzyme';

describe('Block Page', () => {
  it('should check for snapshot', () => {
    const updatedMatch = Object.assign({}, match, {
      params: { height: '12', id: '1' },
    });
    const wrapper = mount(
      <Router keyLength={0}>
        <Provider store={store}>
          <BlockPage
            history={history}
            match={updatedMatch}
            location={location}
          />
        </Provider>
      </Router>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
