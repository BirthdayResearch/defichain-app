import { call, put, takeLatest, select } from 'redux-saga/effects';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';

import * as log from '../../utils/electronLogger';
import {
  fetchTokenInfo,
  fetchTokensRequest,
  fetchTokensFailure,
  fetchTokensSuccess,
  fetchTokenInfoSuccess,
  fetchTokenInfoFailure,
} from './reducer';
import { handleFetchTokens, handleFetchToken } from './service';

export function* getConfigurationDetails() {
  const { configurationData } = yield select((state) => state.app);
  const data = cloneDeep(configurationData);
  if (isEmpty(data)) {
    throw new Error('Unable to fetch configuration file');
  }
  return data;
}

export function* fetchToken(action) {
  const {
    payload: { id },
  } = action;
  try {
    const data = yield call(handleFetchToken, id);
    yield put({
      type: fetchTokenInfoSuccess.type,
      payload: { tokenInfo: data },
    });
  } catch (e) {
    yield put({ type: fetchTokenInfoFailure.type, payload: e.message });
    log.error(e);
  }
}

export function* fetchTokens() {
  try {
    const data = yield call(handleFetchTokens);
    yield put({
      type: fetchTokensSuccess.type,
      payload: { tokens: data },
    });
  } catch (e) {
    yield put({ type: fetchTokensFailure.type, payload: e.message });
    log.error(e);
  }
}

function* mySaga() {
  yield takeLatest(fetchTokenInfo.type, fetchToken);
  yield takeLatest(fetchTokensRequest.type, fetchTokens);
}

export default mySaga;
