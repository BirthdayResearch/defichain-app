import { call, put, takeLatest } from 'redux-saga/effects';

import * as log from '../../utils/electronLogger';
import { getErrorMessage } from '../../utils/utility';
import {
  fetchPoolpair,
  fetchPoolpairSuccess,
  fetchPoolpairFailure,
  fetchTestPoolSwapRequest,
  fetchPoolsharesRequest,
  fetchPoolsharesSuccess,
  fetchPoolsharesFailure,
  fetchPoolPairListRequest,
  fetchTokenBalanceListRequest,
  fetchTokenBalanceListSuccess,
  fetchPoolPairListSuccess,
  addPoolLiquidityRequest,
  addPoolLiquiditySuccess,
  addPoolLiquidityFailure,
  removePoolLiquiditySuccess,
  removePoolLiquidityFailure,
  removePoolLiqudityRequest,
  fetchTestPoolSwapSuccess,
  fetchTestPoolSwapFailure,
  poolSwapRequest,
  poolSwapSuccess,
  poolSwapFailure,
} from './reducer';
import {
  handleAddPoolLiquidity,
  handleFetchPoolPairList,
  handleFetchPoolshares,
  handleFetchTokenBalanceList,
  handleRemovePoolLiquidity,
  handlePoolSwap,
  handleTestPoolSwap,
  handleFetchPoolpair,
} from './service';

function* fetchPoolshares() {
  try {
    const data = yield call(handleFetchPoolshares);
    yield put({
      type: fetchPoolsharesSuccess.type,
      payload: { poolshares: data },
    });
  } catch (e) {
    yield put({
      type: fetchPoolsharesFailure.type,
      payload: e.message,
    });
    log.error(e);
  }
}

function* fetchTokenBalanceList() {
  try {
    const data = yield call(handleFetchTokenBalanceList);
    yield put({ type: fetchTokenBalanceListSuccess.type, payload: data });
  } catch (e) {
    log.error(e);
  }
}

function* fetchTestPoolSwap(action) {
  try {
    const {
      payload: { formState },
    } = action;

    const data = yield call(handleTestPoolSwap, formState);
    yield put({ type: fetchTestPoolSwapSuccess.type, payload: data });
  } catch (e) {
    log.error(e);
    yield put({
      type: fetchTestPoolSwapFailure.type,
      payload: getErrorMessage(e),
    });
  }
}

export function* fetchPoolPair(action) {
  const {
    payload: { id },
  } = action;
  try {
    const data = yield call(handleFetchPoolpair, id);
    yield put({
      type: fetchPoolpairSuccess.type,
      payload: { poolpair: data },
    });
  } catch (e) {
    yield put({ type: fetchPoolpairFailure.type, payload: e.message });
    log.error(e);
  }
}

function* fetchPoolPairList() {
  try {
    const data = yield call(handleFetchPoolPairList);
    yield put({ type: fetchPoolPairListSuccess.type, payload: data });
  } catch (e) {
    log.error(e);
  }
}

function* addPoolLiquidity(action) {
  try {
    const {
      payload: { hash1, amount1, hash2, amount2 },
    } = action;

    const data = yield call(
      handleAddPoolLiquidity,
      hash1,
      amount1,
      hash2,
      amount2
    );
    yield put({ type: addPoolLiquiditySuccess.type, payload: data });
  } catch (e) {
    log.error(e.message);
    yield put({
      type: addPoolLiquidityFailure.type,
      payload: getErrorMessage(e),
    });
  }
}

function* removePoolLiquidity(action) {
  try {
    const {
      payload: { from, amount },
    } = action;

    const data = yield call(handleRemovePoolLiquidity, from, amount);
    yield put({ type: removePoolLiquiditySuccess.type, payload: data });
  } catch (e) {
    log.error(e.message);
    yield put({
      type: removePoolLiquidityFailure.type,
      payload: getErrorMessage(e),
    });
  }
}

function* poolSwap(action) {
  try {
    const {
      payload: { formState },
    } = action;

    const data = yield call(handlePoolSwap, formState);
    yield put({ type: poolSwapSuccess.type, payload: data });
  } catch (e) {
    log.error(e.message);
    yield put({ type: poolSwapFailure.type, payload: getErrorMessage(e) });
  }
}

function* mySaga() {
  yield takeLatest(fetchPoolsharesRequest.type, fetchPoolshares);
  yield takeLatest(fetchPoolPairListRequest.type, fetchPoolPairList);
  yield takeLatest(fetchPoolpair.type, fetchPoolPair);
  yield takeLatest(fetchTestPoolSwapRequest.type, fetchTestPoolSwap);
  yield takeLatest(fetchTokenBalanceListRequest.type, fetchTokenBalanceList);
  yield takeLatest(addPoolLiquidityRequest.type, addPoolLiquidity);
  yield takeLatest(removePoolLiqudityRequest.type, removePoolLiquidity);
  yield takeLatest(poolSwapRequest.type, poolSwap);
}

export default mySaga;
