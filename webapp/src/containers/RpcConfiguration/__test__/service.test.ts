import * as services from '../service';
import { isBlockchainStarted } from './testData.json';
import { mockAxios } from '../../../utils/testUtils/mockUtils';
import {
  BLOCKCHAIN_START_ERROR,
  BLOCKCHAIN_START_SUCCESS,
} from '../../../constants';

describe('RPC configuration unit test', () => {
  it('should test for isBlockchainStarted', async () => {
    const post = jest.fn().mockResolvedValueOnce({
      data: isBlockchainStarted,
    });
    mockAxios(post);
    const test = await services.isBlockchainStarted();
    expect(test).toEqual({
      status: true,
      message: BLOCKCHAIN_START_SUCCESS,
    });
    expect(post).toBeCalledTimes(1);
  });

  it('should test for isBlockchainStarted', async () => {
    const post = jest.fn().mockRejectedValue({});
    const spy = jest.spyOn(services, 'sleep').mockResolvedValue({});
    mockAxios(post);
    const test = await services.isBlockchainStarted();
    expect(test).toEqual({
      message: BLOCKCHAIN_START_ERROR,
      status: false,
    });
    expect(post).toBeCalledTimes(51);
    expect(spy).toBeCalledTimes(51);
    spy.mockClear();
  });
});
