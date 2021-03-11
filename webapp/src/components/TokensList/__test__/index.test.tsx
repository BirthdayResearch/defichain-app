import React from 'react';
import TokensList from '../index';
import Enzyme from '../../../utils/testUtils/enzyme';
import * as routeComponentProps from '../../../utils/testUtils/routeComponentProps';

describe('WalletTokensList component', () => {
  it('should check for snapshot', () => {
    const wrapper = Enzyme.mount(
      <TokensList
        history={routeComponentProps.history}
        tokens={[]}
        unit={''}
        accountTokens={[]}
        walletBalance={0}
        getPathAddress={(pagePath, symbol, hash, amount, address, isLPS) => ''}
        pagePath={'/'}
        isLoadingTokens={false}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
