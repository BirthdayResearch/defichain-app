import React from 'react';
import SwapTab from '../components/SwapTab';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../../../app/rootStore';
import Enzyme from '../../../utils/testUtils/enzyme';
import { I18n } from 'react-redux-i18n';
import BigNumber from 'bignumber.js';

describe('SwapTab component', () => {
  it.skip('should check for snapshot', () => {
    const wrapper = Enzyme.mount(
      <Router>
        <Provider store={store}>
          <SwapTab
            slippage={new BigNumber(3)}
            setSlippage={jest.fn()}
            setSlippageError={jest.fn()}
            label={I18n.t('containers.swap.swapTab.from')}
            tokenMap={new Map()}
            filterBySymbol={() => ''}
            name={1}
            isLoadingTestPoolSwapTo={false}
            isLoadingTestPoolSwapFrom={false}
            formState={{}}
            handleChangeFrom={() => ''}
            handleChangeTo={() => ''}
            handleDropdown={() => ''}
            setMaxValue={() => ''}
            handleInterchange={() => ''}
            dropdownLabel={I18n.t('components.swapCard.selectAToken')}
          />
        </Provider>
      </Router>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
