import React from 'react';
import BlockTxn from '../components/BlockTxn';
import { shallow } from 'enzyme';
const txn = {
  hash: '2446f1fd773fbb9f080e674b60c6a033c7ed7427b8b9413cf28a2a4a6da9b56c',
  time: '1591108054',
  froms: [
    {
      address: 'bcrt1qw2grcyqu9jfdwgrggtpasq0vdtwvecty4vf4jk',
      amount: 10,
    },
  ],
  tos: [
    {
      address: 'bcrt1qw2grcyqu9jfdwgrggtpasq0vdtwvecty4vf28k',
      amount: 1,
    },
  ],
  unit: 'DFI',
};

describe('BlockTxn component', () => {
  it('should check for snapshot', () => {
    const wrapper = shallow(<BlockTxn txn={txn} unit={'DFI'} />);
    expect(wrapper).toMatchSnapshot();
  });
});
