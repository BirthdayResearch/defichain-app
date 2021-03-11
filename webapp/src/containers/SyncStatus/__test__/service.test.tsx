import * as service from '../service';
import {
  mockPersistentStore,
  mockAxios,
} from '../../../utils/testUtils/mockUtils';
import * as Utility from '../../../utils/utility';
import { MAINNET } from '../../../constants';

describe('SyncStatus page service unit test', () => {
  it('should return block sync info data', async () => {
    const post = jest
      .fn()
      .mockResolvedValueOnce({ data: { result: 1 } })
      .mockResolvedValueOnce({ data: { result: { data: 1 } } });
    mockAxios(post);

    const result = await service.getBlockSyncInfo();
    expect(typeof result).toEqual(
      typeof {
        latestSyncedBlock: 1,
        latestBlock: 557147,
        syncedPercentage: '0.00',
      }
    );
  });

  it('should check for errors in getBlockSyncInfo', async () => {
    try {
      const post = jest
        .fn()
        .mockImplementationOnce(() => Promise.reject('Error'));
      mockAxios(post);
      const result = await service.getBlockSyncInfo();
    } catch (err) {
      expect(err).toBeTruthy();
    }
  });
});
