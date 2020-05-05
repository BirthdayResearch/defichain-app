import { call, put, takeLatest } from "redux-saga/effects";
import {
  fetchMasternodesRequest,
  fetchMasternodesSuccess,
  fetchMasternodesFailure,
} from "./reducer";
import { handelFetchMasterNodes } from "./MasterNodesPage.service";

function* fetchMasterNodes() {
  try {
    const data = yield call(handelFetchMasterNodes);
    if (data && data.masternodes) {
      yield put({ type: fetchMasternodesSuccess.type, payload: { ...data } });
    } else {
      yield put({
        type: fetchMasternodesFailure.type,
        payload: "No data found",
      });
    }
  } catch (e) {
    yield put({ type: fetchMasternodesFailure.type, payload: e.message });
    console.log(e);
  }
}

function* mySaga() {
  yield takeLatest(fetchMasternodesRequest.type, fetchMasterNodes);
}

export default mySaga;
