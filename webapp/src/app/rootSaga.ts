import createSagaMiddleware from 'redux-saga';
import { all, fork } from 'redux-saga/effects';
import startUpSaga from './startupSaga';
import appSaga from '../containers/RpcConfiguration/saga';
import blockchainSaga from '../containers/BlockchainPage/saga';
import masterNodesSaga from '../containers/MasternodesPage/saga';
import walletSaga from '../containers/WalletPage/saga';
import settingsSaga from '../containers/SettingsPage/saga';
import syncStatusSaga from '../containers/SyncStatus/saga';

function* rootSaga() {
  yield all([
    fork(startUpSaga),
    fork(appSaga),
    fork(blockchainSaga),
    fork(masterNodesSaga),
    fork(walletSaga),
    fork(settingsSaga),
    fork(syncStatusSaga),
  ]);
}

const sagaMiddleware = createSagaMiddleware();

export const startSaga = () => {
  sagaMiddleware.run(rootSaga);
};

export default sagaMiddleware;
