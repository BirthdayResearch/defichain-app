import React from 'react';
import CreateMasterNode from '../components/CreateMasterNode';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { match } from 'react-router';
import { history } from '../../../utils/testUtils/routeComponentProps';
import { createLocation } from 'history';
import store from '../../../app/rootStore';
import { mount } from 'enzyme';
const path = `/route/:hash`;
const match: match<{ hash: string }> = {
  isExact: false,
  path,
  url: path.replace(':hash', '1'),
  params: { hash: '1' },
};
const location = createLocation(match.url);
delete location.key;
const updatedLocation = Object.assign({}, location);
const updatedHistory = Object.assign({}, history, {
  location: updatedLocation,
});

describe('Create Master Node', () => {
  it('should check for snapshot', () => {
    const wrapper = mount(
      <Router>
        <Provider store={store}>
          <CreateMasterNode
            match={match}
            history={updatedHistory}
            location={updatedLocation}
          />
        </Provider>
      </Router>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
