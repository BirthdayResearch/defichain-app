import createSagaMiddleware from "redux-saga";
import { all, fork } from "redux-saga/effects";

function* rootSaga() {
  yield all([]);
}

const sagaMiddleware = createSagaMiddleware();

export const startSaga = () => {
  sagaMiddleware.run(rootSaga);
};

export default sagaMiddleware;
