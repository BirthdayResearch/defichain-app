import createSagaMiddleware from "redux-saga";
import { all, fork } from "redux-saga/effects";
import appSaga from "./saga";
import blockchainSaga from "../containers/BlockchainPage/saga";
import masterNodesSaga from "../containers/MasternodesPage/saga";
import walletSaga from "../containers/WalletPage/saga";
import settingsSaga from "../containers/SettingsPage/saga";

function* rootSaga() {
  yield all([
    fork(appSaga),
    fork(blockchainSaga),
    fork(masterNodesSaga),
    fork(walletSaga),
    fork(settingsSaga),
  ]);
}

const sagaMiddleware = createSagaMiddleware();

export const startSaga = () => {
  sagaMiddleware.run(rootSaga);
};

export default sagaMiddleware;
