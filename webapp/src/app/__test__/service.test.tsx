import * as service from '../service';
import {
  mockIpcRenderer,
  mockisElectron,
  mockAxios,
} from '../../utils/testUtils/mockUtils';
import HttpStatus from 'http-status-codes';
import testData from './testData.json';
import * as RpcService from '../../containers/RpcConfiguration/service';

describe('App Service', () => {
  let ipc;
  let isElectron;
  beforeEach(() => {
    ipc = mockIpcRenderer();
    isElectron = mockisElectron();
  });
  afterEach(() => {
    ipc.mockRestore();
    isElectron.mockRestore();
  });
  afterAll(jest.clearAllMocks);
  it('should check for getRpcConfig', () => {
    const sendSync = jest.fn().mockReturnValue(testData.getRpcConfig);
    isElectron.mockReturnValue(true);
    ipc.mockReturnValue({
      sendSync,
    });
    const data = service.getRpcConfig();
    expect(data).toEqual(testData.getRpcConfig);
    expect(sendSync).toBeCalledTimes(1);
    expect(ipc).toBeCalledTimes(1);
  });
  it('should check for if iselectron is false', async () => {
    const data = await service.getRpcConfig();
    expect(data).toEqual({
      success: true,
      data: {},
    });
  });

  it('should check for stopNode', () => {
    const sendSync = jest.fn().mockReturnValue(testData.getRpcConfig);
    isElectron.mockReturnValue(true);
    ipc.mockReturnValue({
      sendSync,
    });
    const data = service.stopNode();
    expect(data).toEqual(testData.getRpcConfig);
    expect(sendSync).toBeCalledTimes(1);
    expect(ipc).toBeCalledTimes(1);
  });
  it('should check for stopNode if iselectron is false', async () => {
    const data = await service.stopNode();
    expect(data).toEqual({
      success: true,
      data: {},
    });
  });

  it('should check for importWallet', async () => {
    const post = jest.fn().mockResolvedValue({
      status: HttpStatus.OK,
    });
    mockAxios(post);
    await service.importWallet(["m/44'/0'/0'/0/1"]);
    expect(post).toBeCalledTimes(3);
  });

  it('should check for importWallet', async () => {
    const post = jest.fn().mockRejectedValue({});
    mockAxios(post);
    try {
      await service.importWallet(["m/44'/0'/0'/0/1"]);
    } catch (err) {
      expect(err).toEqual({});
      expect(post).toBeCalledTimes(1);
    }
  });

  it('start node', () => {
    const res = {
      success: true,
    };
    const send = jest.fn();
    const spyon = jest
      .spyOn(RpcService, 'isBlockchainStarted')
      .mockImplementation();
    const on = jest.fn((action, callback) => callback(null, res));
    ipc.mockReturnValue({
      send,
      on,
    });
    service.startNode({});
    expect(send).toBeCalledTimes(1);
    expect(on).toBeCalledTimes(1);
    expect(spyon).toBeCalledTimes(1);
  });

  it('start node is false', () => {
    const res = {
      success: false,
    };
    const send = jest.fn();
    const spyon = jest
      .spyOn(RpcService, 'isBlockchainStarted')
      .mockImplementation();
    const on = jest.fn((action, callback) => callback(null, res));
    ipc.mockReturnValue({
      send,
      on,
    });
    service.startNode({});
    expect(send).toBeCalledTimes(1);
    expect(on).toBeCalledTimes(1);
    expect(spyon).toBeCalledTimes(1);
  });
});
