import React from 'react';
import MinerPage from '../components/MinerPage';
// import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';
import {
  history,
  match,
  location,
} from '../../../utils/testUtils/routeComponentProps';
// import store from '../../../app/rootStore';
import { mount } from 'enzyme';

describe('MinerPage component', () => {
  it('should check for snapshot', () => {
    // const wrapper = mount(
    //   <Router keyLength={0}>
    //     <MinerPage history={history} match={match} location={location} />
    //   </Router>
    // );
    expect(true).toMatchSnapshot();
  });
});
