import { takeLatest } from 'redux-saga/effects';
import mySaga, { backupWalletbeforeUpdate } from '../saga';
import { backupLoadingStart, showUpdateAvailable } from '../reducer';
import * as updateRenderer from '../../../app/update.ipcRenderer';
import { dispatchedFunc } from '../../../utils/testUtils/mockUtils';

describe('Console page saga unit test', () => {
  const genObject = mySaga();

  it('should wait for every backupLoadingStart action and call backupWalletbeforeUpdate method', () => {
    expect(genObject.next().value).toEqual(
      takeLatest(backupLoadingStart.type, backupWalletbeforeUpdate)
    );
  });

  describe('backupLoadingStart method', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });
    it('should call api and dispatch success action', async () => {
      const mockObj = jest
        .spyOn(updateRenderer, 'backupWallet')
        .mockResolvedValue(true);
      const dispatched = await dispatchedFunc(backupWalletbeforeUpdate);
      expect(dispatched).toEqual([showUpdateAvailable()]);
    });
    it('should call api and dispatch success action', async () => {
      const mockObj = jest
        .spyOn(updateRenderer, 'backupWallet')
        .mockResolvedValue(false);
      const dispatched = await dispatchedFunc(backupWalletbeforeUpdate);
      expect(dispatched).toEqual([]);
    });
  });
});
