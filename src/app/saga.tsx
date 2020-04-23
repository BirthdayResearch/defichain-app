import { call, put, takeLatest } from "redux-saga/effects";
import {
  getRpcConfigsRequest,
  getRpcConfigsSuccess,
  getRpcConfigsFailure,
  startNodeRequest,
} from "./reducer";
import { getRpcConfig, startBinary } from "./app.service";

function* getConfig() {
  try {
    const res = yield call(getRpcConfig);
    if (res.success) {
      yield put({ type: getRpcConfigsSuccess.type, payload: res.data });
      yield put({ type: startNodeRequest.type, payload: res.data });
      yield call(startBinary, res.data);
    } else {
      yield put({
        type: getRpcConfigsFailure.type,
        payload: res.message || "No data found",
      });
    }
  } catch (e) {
    yield put({ type: getRpcConfigsFailure.type, payload: e.message });
    console.log(e);
  }
}

function* mySaga() {
  yield takeLatest(getRpcConfigsRequest.type, getConfig);
}

export default mySaga;
