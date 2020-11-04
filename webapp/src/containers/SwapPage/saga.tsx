import { call, put, takeLatest } from 'redux-saga/effects';

import * as log from '../../utils/electronLogger';
import { getErrorMessage } from '../../utils/utility';
import {
  fetchPoolsharesRequest,
  fetchPoolsharesSuccess,
  fetchPoolsharesFailure,
  fetchPoolPairListRequest,
  fetchTokenBalanceListRequest,
  fetchTokenBalanceListSuccess,
  fetchPoolPairListSuccess,
  addPoolLiquidityRequest,, addPoolLiquiditySuccess, addPoolLiquidityFailure
} from './reducer';
import {
  handleAddPoolLiquidity,
  handleFetchPoolPairList,
  handleFetchPoolshares,
  handleFetchTokenBalanceList,
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
      payload: { address1, amount1, address2, amount2, shareAddress }
    } = action;

    const data = yield call(
      handleAddPoolLiquidity,
      address1,
      amount1,
      address2,
      amount2,
      shareAddress
    );
    yield put({type: addPoolLiquiditySuccess.type, payload: data});
  } catch (e) {
    log.error(e.message);
    yield put({ type: addPoolLiquidityFailure.type, payload: getErrorMessage(e) });
  }
}

function* mySaga() {
  yield takeLatest(fetchPoolsharesRequest.type, fetchPoolshares);
  yield takeLatest(fetchPoolPairListRequest.type, fetchPoolPairList);
  yield takeLatest(fetchTokenBalanceListRequest.type, fetchTokenBalanceList);
  yield takeLatest(addPoolLiquidityRequest.type, addPoolLiquidity);
}

export default mySaga;
