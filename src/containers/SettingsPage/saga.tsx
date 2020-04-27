import { call, put, takeLatest } from "redux-saga/effects";
import {
  setLanguageRequest,
  setLanguageSuccess,
  setLanguageFailure,
} from "./reducer";

function* connect() {
  try {
    const data = yield call(handelAccountChanged);
    if (data && data.address && data.network) {
      yield put({ type: setLanguageSuccess.type, payload: { ...data } });
    } else {
      yield put({
        type: setLanguageFailure.type,
        payload: "No data found",
      });
    }
  } catch (e) {
    yield put({ type: setLanguageFailure.type, payload: e.message });
    console.log(e);
  }
}

function handelAccountChanged() {
  return function (d) {
    console.log(d);
  };
}
function* mySaga() {
  yield takeLatest(setLanguageRequest.type, connect);
}

export default mySaga;
