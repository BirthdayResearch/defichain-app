// TODO: fix the test RPC configuration service
import { isBlockchainStarted } from '../service';
import * as testData from './testData.json';
import { mockAxios } from '../../../utils/testUtils/mockUtils';
import { DIFF } from '../../../constants';

describe('Name of the group', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
  });
  it('should check for isBlockChainFunc', async () => {
    const post = jest
      .fn()
      .mockResolvedValue({ data: testData.isBlockchainStarted });
    const emmitter = jest.fn();
    mockAxios(post);
    isBlockchainStarted(emmitter, {});
    jest.advanceTimersByTime(DIFF);
    expect(post).toBeCalledTimes(1);
    expect(setInterval).toBeCalledTimes(1);
    expect(setInterval).toHaveBeenLastCalledWith(expect.any(Function), DIFF);
  });

  it('should check for isBlockChainFunc', async () => {
    const count = 50;
    const post = jest.fn().mockRejectedValue('Error');
    const emmitter = jest.fn();
    mockAxios(post);
    isBlockchainStarted(emmitter, {});
    jest.advanceTimersByTime(DIFF * count);
    expect(post).toBeCalledTimes(count);
    expect(setInterval).toBeCalledTimes(1);
    expect(setInterval).toHaveBeenLastCalledWith(expect.any(Function), DIFF);
  });
});
