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
  fetchPoolpair,
  fetchPoolpairSuccess,
  fetchPoolpairFailure,
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
  fetchUtxoDfiRequest,
  fetchUtxoDfiFailure,
  fetchUtxoDfiSuccess,
  fetchMaxAccountDfiSuccess,
  fetchMaxAccountDfiFailure,
} from './reducer';
import {
  handleAddPoolLiquidity,
  handleFetchPoolPairList,
  handleFetchPoolshares,
  handleRemovePoolLiquidity,
  handleFetchPoolpair,
} from './service';

export function* fetchPoolshares() {
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

export function* fetchTokenBalanceList() {
  try {
    const data = yield call(handleFetchTokenBalanceList);
    yield put({ type: fetchTokenBalanceListSuccess.type, payload: data });
  } catch (e) {
    log.error(e);
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

export function* fetchPoolPairList() {
  try {
    const data = yield call(handleFetchPoolPairList);
    yield put({ type: fetchPoolPairListSuccess.type, payload: data });
  } catch (e) {
    log.error(e);
  }
}

export function* addPoolLiquidity(action) {
  try {
    const {
      payload: { hash1, amount1, hash2, amount2, shareAddress },
    } = action;

    const data = yield call(
      handleAddPoolLiquidity,
      hash1,
      amount1,
      hash2,
      amount2,
      shareAddress
    );
    yield put({ type: addPoolLiquiditySuccess.type, payload: data });
  } catch (e) {
    log.error(e.message);
    yield put({
      type: addPoolLiquidityFailure.type,
      payload: checkRPCErrorMessagePending(getErrorMessage(e)),
    });
  }
}

export function* removePoolLiquidity(action) {
  try {
    const {
      payload: { poolID, amount, address, poolpair },
    } = action;
    const data = yield call(
      handleRemovePoolLiquidity,
      poolID,
      amount,
      address,
      poolpair
    );
    yield put({ type: removePoolLiquiditySuccess.type, payload: data });
  } catch (e) {
    log.error(e.message);
    yield put({
      type: removePoolLiquidityFailure.type,
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
  yield takeLatest(fetchPoolsharesRequest.type, fetchPoolshares);
  yield takeLatest(fetchPoolPairListRequest.type, fetchPoolPairList);
  yield takeLatest(fetchPoolpair.type, fetchPoolPair);
  yield takeLatest(fetchTokenBalanceListRequest.type, fetchTokenBalanceList);
  yield takeLatest(addPoolLiquidityRequest.type, addPoolLiquidity);
  yield takeLatest(removePoolLiqudityRequest.type, removePoolLiquidity);
  yield takeLatest(fetchUtxoDfiRequest.type, fetchUtxoDfi);
  yield takeLatest(fetchMaxAccountDfiRequest.type, fetchMaxAccountDfi);
}

export default mySaga;
