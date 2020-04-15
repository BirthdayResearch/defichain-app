import { call, put, takeLatest } from "redux-saga/effects";
import {
  getRpcConfigsRequest,
  getRpcConfigsSuccess,
  getRpcConfigsFailure,
} from "./reducer";
import { getRpcConfig } from "./app.service";

function* getConfig() {
  try {
    const data = yield call(getRpcConfig);
    if (data) {
      yield put({ type: getRpcConfigsSuccess.type, payload: { ...data } });
    } else {
      yield put({
        type: getRpcConfigsFailure.type,
        payload: "No data found",
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
