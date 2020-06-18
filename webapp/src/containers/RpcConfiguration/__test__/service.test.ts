import * as services from '../service';
import log from 'loglevel';

describe('RPC configuration unit test', () => {
  it('should test for blockChainStartEmitFunction', async () => {
    const isInitialBlockDownloadMock = jest.fn().mockResolvedValue(true);
    const rpcClient = {
      isInitialBlockDownload: isInitialBlockDownloadMock,
    };
    const emitter = jest.fn();
    await services.blockChainStartEmitFunction(rpcClient, emitter);
    expect(isInitialBlockDownloadMock).toBeCalledTimes(1);
    expect(emitter).toBeCalledTimes(1);
  });

  it('should test for blockChainStartEmitFunction if failed attempts is reached', async () => {
    const spy = jest.spyOn(log, 'error');
    const isInitialBlockDownloadMock = jest.fn().mockRejectedValue('error');
    const rpcClient = {
      isInitialBlockDownload: isInitialBlockDownloadMock,
    };
    const emitter = jest.fn();
    await services.blockChainStartEmitFunction(rpcClient, emitter);
    expect(isInitialBlockDownloadMock).toBeCalledTimes(1);
    expect(spy).toBeCalledTimes(1);
  });
});
