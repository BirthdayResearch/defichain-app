import createSagaMiddleware from "redux-saga";
import { all, fork } from "redux-saga/effects";
import blockhainSaga from "../containers/BlockchainPage/saga";
import masterNodesSaga from "../containers/MasternodesPage/saga";
import walletSaga from "../containers/WalletPage/saga";
function* rootSaga() {
  yield all([fork(blockhainSaga), fork(masterNodesSaga), fork(walletSaga)]);
}

const sagaMiddleware = createSagaMiddleware();

export const startSaga = () => {
  sagaMiddleware.run(rootSaga);
};

export default sagaMiddleware;
