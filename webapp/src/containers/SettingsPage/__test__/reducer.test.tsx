import reducer, {
  initialState,
  getSettingOptionsSuccess,
  getSettingOptionsFailure,
  getInitialSettingsRequest,
  getInitialSettingsSuccess,
  getInitialSettingsFailure,
  updateSettingsRequest,
  updateSettingsSuccess,
  updateSettingsFailure,
} from '../reducer';
import { sagaTestData, serviceTestData } from './testData.json';
const errorMessage = 'Error Occurred';

describe('settings slice', () => {
  const nextState = initialState;

  it('should return the initial state', () => {
    const result = reducer(undefined, { type: undefined });
    expect(result).toEqual(nextState);
  });

  describe('getSettingOptionsRequest reducers and actions', () => {
    it('should propely set languages, amountUnits, displayModes information when getSettingOptionsSuccess is made', () => {
      const nextState = reducer(
        initialState,
        getSettingOptionsSuccess(sagaTestData.getSettingsOptions)
      );
      const rootState = { settings: nextState };
      expect(rootState.settings.languages).toEqual(
        sagaTestData.getSettingsOptions.languages
      );
      expect(rootState.settings.amountUnits).toEqual(
        sagaTestData.getSettingsOptions.amountUnits
      );
      expect(rootState.settings.displayModes).toEqual(
        sagaTestData.getSettingsOptions.displayModes
      );
    });

    it('should have empty languages, amountUnits, displayModes information when getSettingOptionsFailure is made', () => {
      const nextState = reducer(initialState, getSettingOptionsFailure({}));
      const rootState = { settings: nextState };
      expect(rootState.settings.languages).toEqual([]);
      expect(rootState.settings.amountUnits).toEqual([]);
      expect(rootState.settings.displayModes).toEqual([]);
    });
  });

  describe('getInitialSettingsRequest reducers and actions', () => {
    it('should properly set isFetching information when getInitialSettingsRequest is made', () => {
      const nextState = reducer(initialState, getInitialSettingsRequest());
      const rootState = { settings: nextState };
      expect(rootState.settings.isFetching).toBeTruthy();
    });

    it('should propely set appConfig, isFetching, settingsError information when getInitialSettingsSuccess is made', () => {
      const nextState = reducer(
        initialState,
        getInitialSettingsSuccess(serviceTestData.initialData)
      );
      const rootState = { settings: nextState };
      expect(rootState.settings.appConfig).toEqual(serviceTestData.initialData);
      expect(rootState.settings.isFetching).toEqual(false);
      expect(rootState.settings.settingsError).toEqual('');
    });

    it('should properly set isFetching, settingsError information when getInitialSettingsFailure is made', () => {
      const nextState = reducer(
        initialState,
        getInitialSettingsFailure(errorMessage)
      );
      const rootState = { settings: nextState };
      expect(rootState.settings.isFetching).toEqual(false);
      expect(rootState.settings.settingsError).toEqual(errorMessage);
    });
  });

  describe('updateSettingsRequest reducers and actions', () => {
    it('should properly set isUpdating and isBalanceError information when updateSettingsRequest is made', () => {
      const nextState = reducer(initialState, updateSettingsRequest({}));
      const rootState = { settings: nextState };
      expect(rootState.settings.isUpdating).toEqual(true);
    });

    it('should properly set isUpdating, settingsError and appConfig information when updateSettingsSuccess is made', () => {
      const nextState = reducer(
        initialState,
        updateSettingsSuccess(sagaTestData.updateSettings)
      );
      const rootState = { settings: nextState };
      expect(rootState.settings.appConfig).toEqual(sagaTestData.updateSettings);
      expect(rootState.settings.isUpdating).toEqual(false);
      expect(rootState.settings.settingsError).toEqual('');
    });

    it('should properly set isFetching, settingsError information when updateSettingsFailure is made', () => {
      const nextState = reducer(
        initialState,
        updateSettingsFailure(errorMessage)
      );
      const rootState = { settings: nextState };
      expect(rootState.settings.isUpdating).toEqual(false);
      expect(rootState.settings.settingsError).toEqual(errorMessage);
    });
  });
});
