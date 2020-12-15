import * as service from '../service';
import { getpubkey } from './testData.json';
import {
  mockIpcRenderer,
  mockisElectron,
} from '../../../utils/testUtils/mockUtils';

describe('Ledger page service unit test', () => {
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

  it('should check for get pubkey from ledger', async () => {
    const sendSync = jest.fn().mockReturnValue(getpubkey);
    isElectron.mockReturnValue(true);
    ipc.mockReturnValue({
      sendSync,
    });
    // @ts-ignore
    const data = await service.getPubKeyLedger();
    expect(data).toEqual(getpubkey);
  });
});
