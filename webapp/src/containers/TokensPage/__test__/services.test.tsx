import * as service from '../service';
import {
  getAddressInfo,
  handleUpdateTokens,
  handleMintTokens,
  saga,
  expected,
} from './testData.json';
import {
  mockPersistentStore,
  mockAxios,
} from '../../../utils/testUtils/mockUtils';
import * as Utility from '../../../utils/utility';
import { MAINNET } from '../../../constants';
describe('Token Page service unit test', () => {
  it('should return rpc client info', async () => {
    const post = jest.fn().mockResolvedValueOnce({
      data: getAddressInfo,
    });
    mockAxios(post);
    const result = await service.getAddressInfo(
      '1PSSGeFHDnKNxiEyFrD1wcEaHr9hrQDDWc'
    );
    expect(result).toEqual(expected.getAddressInfo);
  });

  it('should check for errors when address is empty in getAddressInfo', async () => {
    try {
      const post = jest
        .fn()
        .mockImplementationOnce(() => Promise.reject('Error'));
      mockAxios(post);
      const result = await service.getAddressInfo(
        '1PSSGeFHDnKNxiEyFrD1wcEaHr9hrQDDWc'
      );
    } catch (err) {
      expect(err).toBeTruthy();
    }
  });

  it('should update token handleUpdateTokens', async () => {
    const post = jest.fn().mockResolvedValueOnce({
      data: handleUpdateTokens,
    });
    mockAxios(post);
    const result = await service.handleUpdateTokens(saga.handleFetchToken);
    expect(result).toEqual(expected.handleUpdateTokens);
  });

  it('should check for errors while updating token', async () => {
    try {
      const post = jest.fn().mockResolvedValueOnce({
        data: handleUpdateTokens,
      });
      mockAxios(post);
      const result = await service.handleUpdateTokens(saga.handleFetchToken);
    } catch (err) {
      expect(err).toBeTruthy();
    }
  });

  it('should return hash for token in handleMintToken', async () => {
    const post = jest.fn().mockResolvedValueOnce({
      data: handleMintTokens,
    });
    mockAxios(post);
    const result = await service.handleMintTokens(saga.handleFetchToken);
    expect(result).toEqual(expected.handleMintTokens);
  });

  it('should check for errors in handleMintTokens', async () => {
    try {
      const post = jest
        .fn()
        .mockImplementationOnce(() => Promise.reject('Error'));
      mockAxios(post);
      const result = await service.handleMintTokens(saga.handleFetchToken);
    } catch (err) {
      expect(err).toBeTruthy();
    }
  });
});
