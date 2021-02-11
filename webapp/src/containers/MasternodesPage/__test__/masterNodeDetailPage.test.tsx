import React from 'react';
import MasterNodeDetailPage from '../components/MasterNodeDetailPage';
import { match } from 'react-router';
import { Provider } from 'react-redux';
import store from '../../../app/rootStore';
import { shallow } from 'enzyme';
import { history } from '../../../utils/testUtils/routeComponentProps';
import { createLocation } from 'history';
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

describe('Master Node Detail Page', () => {
  it('should check for snapshot', () => {
    const props = {
      masternodes: [],
      resignMasterNode: () => {},
      isMasterNodeResigning: true,
      resignedMasterNodeData: 'resignedMasterNodeData',
      isErrorResigningMasterNode: 'isErrorResigningMasterNode',
    };
    const wrapper = shallow(
      <Provider store={store}>
        <MasterNodeDetailPage
          match={match}
          {...props}
          history={updatedHistory}
          location={updatedLocation}
        />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
