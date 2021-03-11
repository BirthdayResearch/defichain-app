import { call, put, takeLatest, select } from 'redux-saga/effects';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';

import * as log from '../../utils/electronLogger';
import { getErrorMessage, remapNodeError } from '../../utils/utility';
import {
  fetchTokenInfo,
  fetchTokensRequest,
  fetchTokensFailure,
  fetchTokensSuccess,
  fetchTokenInfoSuccess,
  fetchTokenInfoFailure,
  fetchTransfersRequest,
  fetchTransfersFailure,
  fetchTransfersSuccess,
  createToken,
  createTokenSuccess,
  createTokenFailure,
  destroyToken,
  destroyTokenFailure,
  destroyTokenSuccess,
  updateToken,
  updateTokenSuccess,
  updateTokenFailure,
  mintToken,
  mintTokenSuccess,
  mintTokenFailure,
} from './reducer';
import {
  handleFetchTokens,
  handleFetchToken,
  handleTokenTransfers,
  handleCreateTokens,
  handleDestroyToken,
  handleUpdateTokens,
  handleMintTokens,
} from './service';
import { ErrorMessages, ResponseMessages } from '../../constants/common';
import { RootState } from '../../app/rootTypes';

export function* getConfigurationDetails() {
  const { rpcConfig } = yield select((state: RootState) => state.app);
  const data = cloneDeep(rpcConfig);
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

export function* fetchTransfers(action) {
  const {
    payload: { id },
  } = action;
  try {
    const data = yield call(handleTokenTransfers, id);
    yield put({
      type: fetchTransfersSuccess.type,
      payload: { transfers: data },
    });
  } catch (e) {
    yield put({ type: fetchTransfersFailure.type, payload: e.message });
    log.error(e);
  }
}

export function* createTokens(action) {
  try {
    const {
      payload: { tokenData },
    } = action;
    const data = yield call(handleCreateTokens, tokenData);
    yield put({ type: createTokenSuccess.type, payload: { ...data } });
  } catch (e) {
    yield put({
      type: createTokenFailure.type,
      payload: remapNodeError(getErrorMessage(e)),
    });
    log.error(e);
  }
}

export function* mintTokens(action) {
  try {
    const {
      payload: { tokenData },
    } = action;
    const data = yield call(handleMintTokens, tokenData);
    yield put({ type: mintTokenSuccess.type, payload: { ...data } });
  } catch (e) {
    yield put({
      type: mintTokenFailure.type,
      payload: remapNodeError(getErrorMessage(e)),
    });
    log.error(e);
  }
}

export function* updateTokens(action) {
  try {
    const {
      payload: { tokenData },
    } = action;
    const data = yield call(handleUpdateTokens, tokenData);
    yield put({ type: updateTokenSuccess.type, payload: { ...data } });
  } catch (e) {
    yield put({
      type: updateTokenFailure.type,
      payload: remapNodeError(getErrorMessage(e)),
    });
    log.error(e);
  }
}

export function* tokenDestroy(action) {
  try {
    const {
      payload: { id },
    } = action;
    const data = yield call(handleDestroyToken, id);
    yield put({ type: destroyTokenSuccess.type, payload: data });
  } catch (e) {
    yield put({
      type: destroyTokenFailure.type,
      payload: remapNodeError(getErrorMessage(e)),
    });
    log.error(e);
  }
}

function* mySaga() {
  yield takeLatest(fetchTokenInfo.type, fetchToken);
  yield takeLatest(fetchTokensRequest.type, fetchTokens);
  yield takeLatest(createToken.type, createTokens);
  yield takeLatest(destroyToken.type, tokenDestroy);
  yield takeLatest(mintToken.type, mintTokens);
  yield takeLatest(updateToken.type, updateTokens);
  yield takeLatest(fetchTransfersRequest.type, fetchTransfers);
}

export default mySaga;
