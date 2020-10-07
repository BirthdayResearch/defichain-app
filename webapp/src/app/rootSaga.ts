import createSagaMiddleware from 'redux-saga';
import { all, fork } from 'redux-saga/effects';
import startUpSaga from './startupSaga';
import appSaga from '../containers/RpcConfiguration/saga';
import blockchainSaga from '../containers/BlockchainPage/saga';
import masterNodesSaga from '../containers/MasternodesPage/saga';
import tokensSaga from '../containers/TokensPage/saga';
import walletSaga from '../containers/WalletPage/saga';
import settingsSaga from '../containers/SettingsPage/saga';
import syncStatusSaga from '../containers/SyncStatus/saga';
import consoleSaga from '../containers/ConsolePage/saga';
import popOverSaga from '../containers/PopOver/saga';

function* rootSaga() {
  yield all([
    fork(startUpSaga),
    fork(appSaga),
    fork(blockchainSaga),
    fork(masterNodesSaga),
    fork(tokensSaga),
    fork(walletSaga),
    fork(settingsSaga),
    fork(syncStatusSaga),
    fork(consoleSaga),
    fork(popOverSaga),
  ]);
}

const sagaMiddleware = createSagaMiddleware();

export const startSaga = () => {
  sagaMiddleware.run(rootSaga);
};

export default sagaMiddleware;
