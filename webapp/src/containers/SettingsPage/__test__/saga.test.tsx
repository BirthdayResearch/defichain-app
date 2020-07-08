import { takeLatest } from 'redux-saga/effects';

import mySaga, {
  getSettingsOptions,
  getSettings,
  updateSettings,
} from '../saga';
import {
  getSettingOptionsRequest,
  getSettingOptionsSuccess,
  getSettingOptionsFailure,
  getInitialSettingsRequest,
  getInitialSettingsSuccess,
  getInitialSettingsFailure,
  updateSettingsRequest,
  updateSettingsSuccess,
  updateSettingsFailure,
} from '../reducer';
import * as service from '../service';
import { sagaTestData, serviceTestData } from './testData.json';
import { dispatchedFunc } from '../../../utils/testUtils/mockUtils';

describe('Wallet page saga unit test', () => {
  const genObject = mySaga();

  it('should wait for every getSettingOptionsRequest action and call getSettingsOptions method', () => {
    expect(genObject.next().value).toEqual(
      takeLatest(getSettingOptionsRequest.type, getSettingsOptions)
    );
  });

  it('should wait for every getInitialSettingsRequest action and call getInitialSettingsRequest method', () => {
    expect(genObject.next().value).toEqual(
      takeLatest(getInitialSettingsRequest.type, getSettings)
    );
  });

  it('should wait for every updateSettingsRequest action and call updateSettings method', () => {
    expect(genObject.next().value).toEqual(
      takeLatest(updateSettingsRequest.type, updateSettings)
    );
  });

  describe('getSettingsOptions method', () => {
    it('should call api and dispatch success action', async () => {
      const dispatched = await dispatchedFunc(getSettingsOptions);

      expect(dispatched).toEqual([
        getSettingOptionsSuccess(sagaTestData.getSettingsOptions),
      ]);
    });

    it('should call api and dispatch failure action', async () => {
      const language = jest
        .spyOn(service, 'getLanguage')
        .mockImplementation(() => {
          throw new Error('error while fetching language');
        });

      const dispatched = await dispatchedFunc(getSettingsOptions);

      expect(language).toHaveBeenCalledTimes(1);
      expect(dispatched).toEqual([
        getSettingOptionsFailure('error while fetching language'),
      ]);
    });
  });

  describe('getSettings method', () => {
    let initialData;

    beforeEach(() => {
      initialData = jest.spyOn(service, 'initialData');
    });

    afterEach(() => {
      initialData.mockRestore();
    });

    afterAll(() => {
      initialData.mockClear();
    });

    it('should call api and dispatch success action', async () => {
      initialData.mockImplementation(() =>
        Promise.resolve(serviceTestData.initialData)
      );

      const dispatched = await dispatchedFunc(getSettings);

      expect(initialData).toHaveBeenCalledTimes(1);
      expect(dispatched).toEqual([
        getInitialSettingsSuccess(serviceTestData.initialData),
      ]);
    });

    it('should call api and dispatch failure action', async () => {
      initialData.mockImplementation(() =>
        Promise.reject({ message: 'error while fetching initial data' })
      );

      const dispatched = await dispatchedFunc(getSettings);

      expect(initialData).toHaveBeenCalledTimes(1);
      expect(dispatched).toEqual([
        getInitialSettingsFailure('error while fetching initial data'),
      ]);
    });
  });

  describe('updateSettings method', () => {
    let updateSettingsData;

    beforeEach(() => {
      updateSettingsData = jest.spyOn(service, 'updateSettingsData');
    });

    afterEach(() => {
      updateSettingsData.mockRestore();
    });

    afterAll(() => {
      updateSettingsData.mockClear();
    });

    it('should call api and dispatch success action', async () => {
      updateSettingsData.mockImplementation(() => sagaTestData.updateSettings);

      const dispatched = await dispatchedFunc(
        updateSettings,
        sagaTestData.updateSettings
      );

      expect(updateSettingsData).toHaveBeenCalledTimes(1);
      expect(dispatched).toEqual([
        updateSettingsSuccess(sagaTestData.updateSettings),
      ]);
    });

    it('should call api and dispatch failure action', async () => {
      updateSettingsData.mockImplementation(() => {
        throw new Error('Error in updateSettingsData');
      });

      const dispatched = await dispatchedFunc(
        updateSettings,
        sagaTestData.updateSettings
      );

      expect(updateSettingsData).toHaveBeenCalledTimes(1);
      expect(dispatched).toEqual([
        updateSettingsFailure('Error in updateSettingsData'),
      ]);
    });
  });
});
