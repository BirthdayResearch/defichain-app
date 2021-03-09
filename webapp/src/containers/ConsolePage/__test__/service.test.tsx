import * as service from '../service';
import { handleDataForQuery, expected } from './testData.json';
import { mockAxios } from '../../../utils/testUtils/mockUtils';

describe('Console Page Service', () => {
  it('should check for handleDataForQuery', async () => {
    const post = jest.fn().mockResolvedValue({ data: handleDataForQuery });
    const query = 'defi-cli getnewaddress';
    mockAxios(post);
    const data = await service.handleDataForQuery(query);
    expect(data).toEqual(expected.handleDataForQuery);
    expect(post).toBeCalledTimes(1);
  });

  it('should check for error in handleDataForQuery', async () => {
    const post = jest.fn().mockRejectedValue('Error');
    const query = 'defi-cli getnewaddress';
    mockAxios(post);
    try {
      const data = await service.handleDataForQuery(query);
    } catch (err) {
      expect(err.message).toBe('Invalid configuration');
      expect(post).toBeCalledTimes(1);
    }
  });
});
