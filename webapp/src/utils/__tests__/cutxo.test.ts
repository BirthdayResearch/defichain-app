import { mockAxios } from '../testUtils/mockUtils';
import { construct } from '../cutxo';
import {
  listUnspentOne,
  listUnspentTwo,
  getNewAddress,
  walletCreateFundedPsbt,
  walletProcessPsbt,
  decodeRawTransaction,
  finalizePsbt,
  expected,
} from './testData.json';
import { BigNumber } from 'bignumber.js';

describe('cutxo', () => {
  it('should check for one time inside loop', async () => {
    const post = jest
      .fn()
      .mockResolvedValueOnce({
        data: listUnspentOne,
      })
      .mockResolvedValueOnce({
        data: getNewAddress,
      })
      .mockResolvedValueOnce({
        data: walletCreateFundedPsbt,
      })
      .mockResolvedValueOnce({
        data: walletProcessPsbt,
      })
      .mockResolvedValueOnce({
        data: finalizePsbt,
      })
      .mockResolvedValueOnce({
        data: decodeRawTransaction,
      });
    mockAxios(post);
    const test = await construct({
      maximumAmount: new BigNumber(1000),
      maximumCount: new BigNumber(650),
      feeRate: new BigNumber(0.1),
    });
    expect(post).toBeCalledTimes(6);
    expect(test).toEqual(expected.cutxo.one_time_inside_loop);
  });

  it('should check for multiple times inside loop', async () => {
    const post = jest
      .fn()
      .mockResolvedValueOnce({
        data: listUnspentTwo,
      })
      .mockResolvedValueOnce({
        data: getNewAddress,
      })
      .mockRejectedValueOnce({ message: 'Transaction too large' })
      .mockResolvedValueOnce({
        data: walletCreateFundedPsbt,
      })
      .mockResolvedValueOnce({
        data: walletProcessPsbt,
      })
      .mockResolvedValueOnce({
        data: finalizePsbt,
      })
      .mockResolvedValueOnce({
        data: decodeRawTransaction,
      })
      .mockResolvedValueOnce({
        data: walletCreateFundedPsbt,
      })
      .mockResolvedValueOnce({
        data: walletProcessPsbt,
      })
      .mockResolvedValueOnce({
        data: finalizePsbt,
      })
      .mockResolvedValueOnce({
        data: decodeRawTransaction,
      });
    mockAxios(post);
    const test = await construct({
      maximumAmount: new BigNumber(1000),
      maximumCount: new BigNumber(650),
      feeRate: new BigNumber(0.1),
    });
    expect(post).toBeCalledTimes(11);
    expect(test).toEqual(expected.cutxo.multiple_time_inside_loop);
  });
});
