import { takeLatest, select, put, call, delay } from 'redux-saga/effects';

import mySaga, {
  getSettingsOptions,
  getSettings,
  updateSettings,
  changeNetworkNode,
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
import {
  DEFAULT_TESTNET_CONNECT,
  DEFAULT_TESTNET_PORT,
  MAINNET,
  TESTNET,
  DEFAULT_MAINNET_CONNECT,
  DEFAULT_MAINNET_PORT,
  BLOCKCHAIN_INFO_CHAIN_TEST,
} from '../../../constants';
import { restartModal } from '../../PopOver/reducer';
import { shutDownBinary } from '../../../worker/queue';
import { restartNode } from '../../../utils/isElectron';

const errorObj = {
  message: 'Error Occurred',
};
describe('Settings page saga unit test', () => {
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
    const mockObj = {
      blockChainInfo: { chain: BLOCKCHAIN_INFO_CHAIN_TEST },
      network: TESTNET,
      ...serviceTestData.initialData,
    };

    it('should call api and dispatch success action', async () => {
      const gen = getSettings();

      expect(JSON.stringify(gen.next().value)).toEqual(
        JSON.stringify(select((state) => state.wallet))
      );
      expect(gen.next(mockObj).value).toEqual(call(service.initialData));
      expect(gen.next(mockObj).value).toEqual(
        put(getInitialSettingsSuccess(mockObj))
      );
      expect(gen.next().done).toBeTruthy();
    });

    it('should call api and dispatch failure action', async () => {
      const gen = getSettings();

      expect(JSON.stringify(gen.next().value)).toEqual(
        JSON.stringify(select((state) => state.syncstatus))
      );
      gen.next(mockObj);
      expect(gen.throw(errorObj).value).toEqual(
        put(getInitialSettingsFailure(errorObj.message))
      );
      expect(gen.next().done).toBeTruthy();
    });
  });

  describe('updateSettings method', () => {
    it('should call api and dispatch success action', async () => {
      const action = {
        payload: {
          ...sagaTestData.updateSettings,
        },
      };
      const gen = updateSettings(action);
      const mockObj = {
        appConfig: { network: TESTNET, launchAtLogin: true },

        ...sagaTestData.updateSettings,
      };

      expect(JSON.stringify(gen.next().value)).toEqual(
        JSON.stringify(select((state) => state.settings))
      );
      expect(gen.next(mockObj).value).toEqual(
        call(service.updateSettingsData, action.payload)
      );

      expect(gen.next(mockObj).value).toEqual(
        put(updateSettingsSuccess(mockObj))
      );
    });

    it('should call api and check for changenetwork method call when network is not equal to previous network', async () => {
      const action = {
        payload: {
          ...sagaTestData.updateSettings,
          network: MAINNET,
        },
      };
      const gen = updateSettings(action);
      const mockObj = {
        appConfig: { network: TESTNET, launchAtLogin: true },

        ...sagaTestData.updateSettings,
      };

      expect(JSON.stringify(gen.next().value)).toEqual(
        JSON.stringify(select((state) => state.settings))
      );
      expect(gen.next(mockObj).value).toEqual(
        call(service.updateSettingsData, action.payload)
      );

      expect(gen.next(mockObj).value).toEqual(
        put(updateSettingsSuccess(mockObj))
      );
      expect(gen.next().value).toEqual(call(changeNetworkNode, MAINNET));
      expect(gen.next().done).toBeTruthy();
    });

    it('should call api and giving null data', async () => {
      const action = {
        payload: {
          ...sagaTestData.updateSettings,
        },
      };
      const gen = updateSettings(action);
      const mockObj = {
        ...sagaTestData.updateSettings,
        appConfig: { network: TESTNET, launchAtLogin: true },
      };

      expect(JSON.stringify(gen.next().value)).toEqual(
        JSON.stringify(select((state) => state.settings))
      );
      expect(gen.next(mockObj).value).toEqual(
        call(service.updateSettingsData, action.payload)
      );
      expect(gen.next().value).toEqual(
        put(updateSettingsFailure('No data found'))
      );
    });

    it('should call api and dispatch failure action', async () => {
      const action = {
        payload: {
          ...sagaTestData.updateSettings,
        },
      };
      const gen = updateSettings(action);
      const mockObj = {
        ...sagaTestData.updateSettings,
      };

      expect(JSON.stringify(gen.next().value)).toEqual(
        JSON.stringify(select((state) => state.settings))
      );
      expect(gen.next().value).toEqual(
        put(
          updateSettingsFailure("Cannot read property 'appConfig' of undefined")
        )
      );
    });
  });

  describe('change network node', () => {
    it('should check for restart func for testnet', async () => {
      const gen = changeNetworkNode(TESTNET);
      expect(JSON.stringify(gen.next().value)).toEqual(
        JSON.stringify(select((state) => state.app))
      );
      const rpcConfig = {
        rpcauth: 'a:b',
        rpcuser: 'a',
        rpcpassword: 'b',
        test: {
          rpcbind: '127.0.0.1',
          rpcport: '8555',
          masternode_operator: '7A9DtwEziu8hNv6rsUYVSa8yXPPczV8Swd',
          masternode_owner: '7Arnd8ic47DESLgUzgpzUcgirRKNt95rhE',
        },
        main: {
          rpcbind: '127.0.0.1',
          rpcport: '8555',
          masternode_operator: '7A9DtwEziu8hNv6rsUYVSa8yXPPczV8Swd',
          masternode_owner: '7Arnd8ic47DESLgUzgpzUcgirRKNt95rhE',
        },
      };
      const name = 'test';
      const result = Object.assign({}, rpcConfig, {
        testnet: '1',
        regtest: '0',
        [name]: {
          rpcbind: DEFAULT_TESTNET_CONNECT,
          rpcport: DEFAULT_TESTNET_PORT,
        },
      });
      expect(gen.next({ rpcConfig }).value).toEqual(put(restartModal()));
      expect(gen.next().value).toEqual(call(shutDownBinary));

      expect(gen.next().value).toEqual(
        call(restartNode, { updatedConf: result })
      );
    });

    it('should check for restart func for mainnet', async () => {
      const gen = changeNetworkNode(MAINNET);
      expect(JSON.stringify(gen.next().value)).toEqual(
        JSON.stringify(select((state) => state.app))
      );
      const rpcConfig = {
        rpcauth: 'a:b',
        rpcuser: 'a',
        rpcpassword: 'b',
        test: {
          rpcbind: '127.0.0.1',
          rpcport: '8555',
          masternode_operator: '7A9DtwEziu8hNv6rsUYVSa8yXPPczV8Swd',
          masternode_owner: '7Arnd8ic47DESLgUzgpzUcgirRKNt95rhE',
        },
        main: {
          rpcbind: '127.0.0.1',
          rpcport: '8555',
          masternode_operator: '7A9DtwEziu8hNv6rsUYVSa8yXPPczV8Swd',
          masternode_owner: '7Arnd8ic47DESLgUzgpzUcgirRKNt95rhE',
        },
      };
      const name = 'main';
      const result = Object.assign({}, rpcConfig, {
        testnet: '0',
        regtest: '0',
        [name]: {
          rpcbind: DEFAULT_MAINNET_CONNECT,
          rpcport: DEFAULT_MAINNET_PORT,
        },
      });
      expect(gen.next({ rpcConfig }).value).toEqual(put(restartModal()));
      expect(gen.next().value).toEqual(call(shutDownBinary));

      expect(gen.next().value).toEqual(
        call(restartNode, { updatedConf: result })
      );
    });
  });

  describe('change network node', () => {
    it('should check for restart func for testnet', async () => {
      const gen = changeNetworkNode(TESTNET);
      expect(JSON.stringify(gen.next().value)).toEqual(
        JSON.stringify(select((state) => state.app))
      );
      const rpcConfig = {
        rpcauth: 'a:b',
        rpcuser: 'a',
        rpcpassword: 'b',
        test: {
          rpcbind: '127.0.0.1',
          rpcport: '8555',
          masternode_operator: '7A9DtwEziu8hNv6rsUYVSa8yXPPczV8Swd',
          masternode_owner: '7Arnd8ic47DESLgUzgpzUcgirRKNt95rhE',
        },
        main: {
          rpcbind: '127.0.0.1',
          rpcport: '8555',
          masternode_operator: '7A9DtwEziu8hNv6rsUYVSa8yXPPczV8Swd',
          masternode_owner: '7Arnd8ic47DESLgUzgpzUcgirRKNt95rhE',
        },
      };
      const name = 'test';
      const result = Object.assign({}, rpcConfig, {
        testnet: '1',
        regtest: '0',
        [name]: {
          rpcbind: DEFAULT_TESTNET_CONNECT,
          rpcport: DEFAULT_TESTNET_PORT,
        },
      });
      expect(gen.next({ rpcConfig }).value).toEqual(put(restartModal()));
      expect(gen.next().value).toEqual(call(shutDownBinary));

      expect(gen.next().value).toEqual(
        call(restartNode, { updatedConf: result })
      );
    });

    it('should check for restart func for mainnet', async () => {
      const gen = changeNetworkNode(MAINNET);
      expect(JSON.stringify(gen.next().value)).toEqual(
        JSON.stringify(select((state) => state.app))
      );
      const rpcConfig = {
        rpcauth: 'a:b',
        rpcuser: 'a',
        rpcpassword: 'b',
        test: {
          rpcbind: '127.0.0.1',
          rpcport: '8555',
          masternode_operator: '7A9DtwEziu8hNv6rsUYVSa8yXPPczV8Swd',
          masternode_owner: '7Arnd8ic47DESLgUzgpzUcgirRKNt95rhE',
        },
        main: {
          rpcbind: '127.0.0.1',
          rpcport: '8555',
          masternode_operator: '7A9DtwEziu8hNv6rsUYVSa8yXPPczV8Swd',
          masternode_owner: '7Arnd8ic47DESLgUzgpzUcgirRKNt95rhE',
        },
      };
      const name = 'main';
      const result = Object.assign({}, rpcConfig, {
        testnet: 0,
        regtest: 0,
        [name]: {
          rpcbind: DEFAULT_MAINNET_CONNECT,
          rpcport: DEFAULT_MAINNET_PORT,
        },
      });
      expect(gen.next({ rpcConfig }).value).toEqual(put(restartModal()));
      expect(gen.next().value).toEqual(call(shutDownBinary));

      expect(gen.next().value).toEqual(
        call(restartNode, { updatedConf: result })
      );
    });
  });
});
