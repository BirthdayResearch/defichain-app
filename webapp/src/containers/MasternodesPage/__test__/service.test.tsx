import * as service from '../service';
import {
  mockPersistentStore,
  mockAxios,
} from '../../../utils/testUtils/mockUtils';
import * as testData from './testData.json';
import * as Utility from '../../../utils/utility';
import { MAINNET } from '../../../constants';

describe('liquidity page service unit test', () => {
  it('should return a private key for the address getPrivateKey', async () => {
    const post = jest.fn().mockResolvedValueOnce({
      data: {
        result: '027dd7f5cc0cf5e20d2c17a7085dd75afca0426ebd95cxxxxxxxxxxxx',
      },
    });
    mockAxios(post);
    const result = await service.getPrivateKey(
      '027dd7f5cc0cf5e20d2c17a7085dd75afca0426ebd95cxxxxxxxxxxxx'
    );
    expect(result).toBe(
      '027dd7f5cc0cf5e20d2c17a7085dd75afca0426ebd95cxxxxxxxxxxxx'
    );
  });

  it('should return a private key for the address importPrivateKey', async () => {
    const post = jest.fn().mockResolvedValueOnce({
      data: {
        result: '027dd7f5cc0cf5e20d2c17a7085dd75afca0426ebd95cxxxxxxxxxxxx',
      },
    });
    mockAxios(post);
    const result = await service.importPrivateKey(
      '027dd7f5cc0cf5e20d2c17a7085dd75afca0426ebd95cxxxxxxxxxxxx'
    );
    expect(result).toBe(
      '027dd7f5cc0cf5e20d2c17a7085dd75afca0426ebd95cxxxxxxxxxxxx'
    );
  });

  it('should check for error when address is not valid getPrivateKey', async () => {
    try {
      const post = jest
        .fn()
        .mockImplementationOnce(() => Promise.reject('Error'));
      mockAxios(post);
      const result = await service.getPrivateKey('');
    } catch (err) {
      expect(err).toBeTruthy();
    }
  });

  it('should check for error when address is not valid importPrivateKey', async () => {
    try {
      const post = jest
        .fn()
        .mockImplementationOnce(() => Promise.reject('Error'));
      mockAxios(post);
      const result = await service.getPrivateKey('');
    } catch (err) {
      expect(err).toBeTruthy();
    }
  });

  it('should return master nodes list', async () => {
    const post = jest.fn().mockResolvedValueOnce({
      data: { result: testData.fetchMasternodesSuccess },
    });
    mockAxios(post);
    const result = await service.handleFetchMasterNodes();
    expect(result).toEqual(testData.fetchMasternodesSuccess);
  });

  it('should return empty master nodes list if masternodes are not present', async () => {
    const post = jest.fn().mockResolvedValueOnce({ data: { result: [] } });
    mockAxios(post);
    const result = await service.handleFetchMasterNodes();
    expect(result).toEqual([]);
  });

  it('should check for errors in handleFetchMasterNodes', async () => {
    try {
      const post = jest
        .fn()
        .mockImplementationOnce(() => Promise.reject('Error'));
      mockAxios(post);
      const result = await service.handleFetchMasterNodes();
    } catch (err) {
      expect(err).toBeTruthy();
    }
  });

  it('should return {} in handleResignMasterNode', async () => {
    const post = jest.fn().mockResolvedValueOnce({ data: { result: {} } });
    mockAxios(post);
    const result = await service.handleResignMasterNode('123');
    expect(result).toEqual({});
  });

  it('should check for errors in handleResignMasterNode', async () => {
    try {
      const post = jest
        .fn()
        .mockImplementationOnce(() => Promise.reject('Error'));
      mockAxios(post);
      const result = await service.handleResignMasterNode('123');
    } catch (err) {
      expect(err).toBeTruthy();
    }
  });
});
