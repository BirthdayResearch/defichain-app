import { call, put, takeLatest } from 'redux-saga/effects';
import * as log from '../../utils/electronLogger';
import {
  getErrorMessage,
  handleFetchTokenDFI,
  handleFetchUtxoDFI,
  handleFetchTokenBalanceList,
  checkRPCErrorMessagePending,
} from '../../utils/utility';
import { fetchMaxAccountDfiRequest } from '../LiquidityPage/reducer';
import {
  fetchTestPoolSwapRequestTo,
  fetchTestPoolSwapRequestFrom,
  fetchPoolPairListRequest,
  fetchTokenBalanceListRequest,
  fetchTokenBalanceListSuccess,
  fetchPoolPairListSuccess,
  fetchTestPoolSwapSuccessTo,
  fetchTestPoolSwapSuccessFrom,
  fetchTestPoolSwapFailureTo,
  fetchTestPoolSwapFailureFrom,
  poolSwapRequest,
  poolSwapSuccess,
  poolSwapFailure,
  fetchUtxoDfiRequest,
  fetchUtxoDfiFailure,
  fetchUtxoDfiSuccess,
  fetchMaxAccountDfiSuccess,
  fetchMaxAccountDfiFailure,
} from './reducer';
import {
  handleFetchPoolPairList,
  handlePoolSwap,
  handleTestPoolSwapTo,
  handleTestPoolSwapFrom,
} from './service';

export function* fetchTokenBalanceList() {
  try {
    const data = yield call(handleFetchTokenBalanceList);
    yield put({ type: fetchTokenBalanceListSuccess.type, payload: data });
  } catch (e) {
    log.error(e);
  }
}

export function* fetchTestPoolSwapTo(action) {
  try {
    const {
      payload: { formState },
    } = action;

    const data = yield call(handleTestPoolSwapTo, formState);
    yield put({ type: fetchTestPoolSwapSuccessTo.type, payload: data });
  } catch (e) {
    log.error(e);
    yield put({
      type: fetchTestPoolSwapFailureTo.type,
      payload: getErrorMessage(e),
    });
  }
}

export function* fetchTestPoolSwapFrom(action) {
  try {
    const {
      payload: { formState },
    } = action;

    const data = yield call(handleTestPoolSwapFrom, formState);
    yield put({ type: fetchTestPoolSwapSuccessFrom.type, payload: data });
  } catch (e) {
    log.error(e);
    yield put({
      type: fetchTestPoolSwapFailureFrom.type,
      payload: getErrorMessage(e),
    });
  }
}

export function* fetchPoolPairList() {
  try {
    const data = yield call(handleFetchPoolPairList);
    yield put({ type: fetchPoolPairListSuccess.type, payload: data });
  } catch (e) {
    log.error(e);
  }
}

export function* poolSwap(action) {
  try {
    const {
      payload: { formState },
    } = action;

    const data = yield call(handlePoolSwap, formState);
    yield put({ type: poolSwapSuccess.type, payload: data });
  } catch (e) {
    log.error(e.message);
    yield put({
      type: poolSwapFailure.type,
      payload: checkRPCErrorMessagePending(getErrorMessage(e)),
    });
  }
}

export function* fetchUtxoDfi() {
  try {
    const data = yield call(handleFetchUtxoDFI);
    yield put({ type: fetchUtxoDfiSuccess.type, payload: data });
  } catch (e) {
    log.error(e.message);
    yield put({ type: fetchUtxoDfiFailure.type, payload: getErrorMessage(e) });
  }
}

export function* fetchMaxAccountDfi() {
  try {
    const data = yield call(handleFetchTokenDFI);
    yield put({ type: fetchMaxAccountDfiSuccess.type, payload: data });
  } catch (e) {
    log.error(e.message);
    yield put({
      type: fetchMaxAccountDfiFailure.type,
      payload: getErrorMessage(e),
    });
  }
}

function* mySaga() {
  yield takeLatest(fetchPoolPairListRequest.type, fetchPoolPairList);
  yield takeLatest(fetchTestPoolSwapRequestTo.type, fetchTestPoolSwapTo);
  yield takeLatest(fetchTestPoolSwapRequestFrom.type, fetchTestPoolSwapFrom);
  yield takeLatest(fetchTokenBalanceListRequest.type, fetchTokenBalanceList);
  yield takeLatest(poolSwapRequest.type, poolSwap);
  yield takeLatest(fetchUtxoDfiRequest.type, fetchUtxoDfi);
  yield takeLatest(fetchMaxAccountDfiRequest.type, fetchMaxAccountDfi);
}

export default mySaga;
