import * as service from '../service';
import { DFI_UNIT_MAP, DFI, DEFAULT_UNIT } from '../../../constants';
import {
  mockPersistentStore,
  mockisElectron,
  mockIpcRenderer,
  mockNotification,
} from '../../../utils/testUtils/mockUtils';

import { serviceTestData } from './testData.json';

describe('Settings page service', () => {
  describe('getLanguage function', () => {
    it('should check for get language', () => {
      const data = service.getLanguage();
      expect(data).toBeInstanceOf(Array);
      expect(data.length).toBe(7);
    });
  });

  describe('getAmountUnits function', () => {
    it('should check for getAmountUnits', () => {
      const data = service.getAmountUnits();
      expect(data).toBeInstanceOf(Array);
      expect(data.length).toBe(Object.keys(DFI_UNIT_MAP).length);
    });
  });

  describe('getDisplayModes function', () => {
    it('should check for getDisplayModes', () => {
      const data = service.getDisplayModes();
      expect(data).toBeInstanceOf(Array);
      expect(data.length).toBe(3);
    });
  });

  describe('initialData function', () => {
    let iselec;
    let ipc;
    let notify;

    beforeAll(() => {
      iselec = mockisElectron();
      ipc = mockIpcRenderer();
      notify = mockNotification();
    });
    afterEach(() => {
      iselec.mockClear();
      ipc.mockClear();
      notify.mockClear();
    });
    afterAll(() => {
      jest.clearAllMocks();
    });
    it('should check initalData if no data is present', () => {
      const persistence = mockPersistentStore(null, null);
      const data = service.initialData();
      expect(data).toEqual(serviceTestData.initialData);
      expect(persistence.get).toBeCalledTimes(10);
    });

    it('should check initalData if prelaunch is runing', () => {
      const iselec = mockisElectron();
      const ipc = mockIpcRenderer();
      const result = Object.assign({}, serviceTestData.initialData);
      result.launchAtLogin = true;
      const sendSync = jest.fn().mockReturnValue({
        success: true,
        data: {
          enabled: true,
        },
      });

      ipc.mockReturnValue({
        sendSync,
      });

      iselec.mockReturnValueOnce(true);
      const persistence = mockPersistentStore(null, null);
      const data = service.initialData();
      expect(data).toEqual(result);
      expect(persistence.get).toBeCalledTimes(11);
    });

    it('should check initalData if prelaunch is failed', () => {
      const sendSync = jest.fn().mockReturnValue({
        success: false,
        data: {
          enabled: true,
        },
      });

      ipc.mockReturnValue({
        sendSync,
      });

      iselec.mockReturnValueOnce(true);
      const persistence = mockPersistentStore(null, null);
      const data = service.initialData();
      expect(sendSync).toBeCalledTimes(1);
      expect(notify).toBeCalledTimes(1);
      expect(data).toEqual(serviceTestData.initialData);
      expect(persistence.get).toBeCalledTimes(10);
    });
  });

  describe('updateSettingsData function', () => {
    it('should check for Update Setting data', () => {
      const test = {
        language: '',
        unit: '',
        displayMode: '',
        launchAtLogin: '',
        minimizedAtLaunch: '',
        pruneBlockStorage: '',
        scriptVerificationThreads: '',
        blockStorage: '',
        databaseCache: '',
      };
      const PersistentStore = mockPersistentStore(null, null);
      const data = service.updateSettingsData(test);
      expect(PersistentStore.set).toBeCalledTimes(12);
      expect(data).toEqual(test);
    });
  });

  describe('disablePreLaunchStatus function', () => {
    it('should check disablePreLaunchStatus ', () => {
      const data = service.disablePreLaunchStatus();
      expect(data).toBeFalsy();
    });

    it('should check disablePreLaunchStatus ipcRenderer success ', () => {
      const iselec = mockisElectron();
      const ipc = mockIpcRenderer();
      const sendSync = jest.fn().mockReturnValue({
        success: true,
        data: {
          enabled: true,
        },
      });

      ipc.mockReturnValue({
        sendSync,
      });

      iselec.mockReturnValueOnce(true);
      const data = service.disablePreLaunchStatus();
      expect(data).toBeTruthy();
      iselec.mockClear();
      ipc.mockClear();
    });

    it('should check disablePreLaunchStatus ipcRenderer failed ', () => {
      const iselec = mockisElectron();
      const ipc = mockIpcRenderer();
      const notify = mockNotification();
      const sendSync = jest.fn().mockReturnValue({
        success: false,
        data: {
          enabled: true,
        },
      });

      ipc.mockReturnValue({
        sendSync,
      });

      iselec.mockReturnValueOnce(true);
      const data = service.disablePreLaunchStatus();
      expect(sendSync).toBeCalledTimes(1);
      expect(notify).toBeCalledTimes(1);
      expect(data).toBeFalsy();
      notify.mockClear();
      iselec.mockClear();
      ipc.mockClear();
    });
  });

  describe('enablePreLaunchStatus function', () => {
    it('should check enablePreLaunchStatus ', () => {
      const data = service.enablePreLaunchStatus();
      expect(data).toBeFalsy();
    });

    it('should check enablePreLaunchStatus', () => {
      const iselec = mockisElectron();
      const ipc = mockIpcRenderer();
      const sendSync = jest.fn().mockReturnValue({
        success: true,
        data: {
          enabled: true,
        },
      });

      ipc.mockReturnValue({
        sendSync,
      });

      iselec.mockReturnValueOnce(true);
      const data = service.enablePreLaunchStatus();
      expect(sendSync).toBeCalledTimes(1);
      expect(data).toBeTruthy();
      iselec.mockClear();
      ipc.mockClear();
    });

    it('should check if sendsync is failed enablePreLaunchStatus', () => {
      const iselec = mockisElectron();
      const ipc = mockIpcRenderer();
      const notify = mockNotification();
      const sendSync = jest.fn().mockReturnValue({
        success: false,
        data: {
          enabled: true,
        },
      });

      ipc.mockReturnValue({
        sendSync,
      });

      iselec.mockReturnValueOnce(true);
      const data = service.enablePreLaunchStatus();
      expect(sendSync).toBeCalledTimes(1);
      expect(notify).toBeCalledTimes(1);
      expect(data).toBeFalsy();
      notify.mockClear();
      iselec.mockClear();
      ipc.mockClear();
    });
  });

  describe('getAppConfigUnit', () => {
    it('should check getAppConfigUnit', () => {
      const persistence = mockPersistentStore(DFI, null);
      const data = service.getAppConfigUnit();
      expect(data).toBe(DFI);
      expect(persistence.get).toBeCalledTimes(1);
    });
  });

  describe('getAppConfigUnit', () => {
    it('should check getAppConfigUnit', () => {
      const persistence = mockPersistentStore(DFI, null);
      const data = service.getAppConfigUnit();
      expect(data).toBe(DFI);
      expect(persistence.get).toBeCalledTimes(1);
    });

    it('should check getAppConfigUnit if cache does not contain unit', () => {
      const persistence = mockPersistentStore(null, null);
      const data = service.getAppConfigUnit();
      expect(data).toBe(DEFAULT_UNIT);
      expect(persistence.set).toBeCalledTimes(1);
    });
  });
});
