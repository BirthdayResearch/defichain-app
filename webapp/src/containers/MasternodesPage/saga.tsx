import { call, put, takeLatest, select, delay } from 'redux-saga/effects';
import * as log from '../../utils/electronLogger';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import { shutDownBinary } from '../../worker/queue';
import { I18n } from 'react-redux-i18n';
import {
  fetchMasternodesRequest,
  fetchMasternodesSuccess,
  fetchMasternodesFailure,
  createMasterNode,
  createMasterNodeFailure,
  createMasterNodeSuccess,
  resignMasterNode,
  resignMasterNodeFailure,
  resignMasterNodeSuccess,
  startRestartNodeWithMasterNode,
  finishRestartNodeWithMasterNode,
  setMasterNodeOwnerSuccess,
  setMasterNodeOwnerError,
  setMasterNodeOwner,
} from './reducer';
import { restartModal } from '../ErrorModal/reducer';
import {
  handelFetchMasterNodes,
  handelCreateMasterNodes,
  handleResignMasterNode,
  getAddressInfo,
} from './service';

import { getErrorMessage } from '../../utils/utility';

import { restartNode, isElectron } from '../../utils/isElectron';

export function* getConfigurationDetails() {
  const { configurationData } = yield select((state) => state.app);
  const data = cloneDeep(configurationData);
  if (isEmpty(data)) {
    throw new Error('Unable to fetch configuration file');
  }
  return data;
}

export function* fetchMasterNodes() {
  try {
    const data = yield call(handelFetchMasterNodes);
    yield put({
      type: fetchMasternodesSuccess.type,
      payload: { masternodes: data },
    });
  } catch (e) {
    yield put({
      type: fetchMasternodesFailure.type,
      payload: getErrorMessage(e),
    });
    log.error(e);
  }
}

export function* createMasterNodes(action) {
  try {
    const {
      payload: { masternodeOwner, masternodeOperator },
    } = action;

    const data = yield call(
      handelCreateMasterNodes,
      masternodeOwner,
      masternodeOperator || masternodeOwner
    );
    yield put({ type: createMasterNodeSuccess.type, payload: { ...data } });
  } catch (e) {
    yield put({
      type: createMasterNodeFailure.type,
      payload: getErrorMessage(e),
    });
    log.error(e);
  }
}

export function* masterNodeResign(action) {
  try {
    const {
      payload: { masterNodeHash },
    } = action;
    const data = yield call(handleResignMasterNode, masterNodeHash);
    yield put({ type: resignMasterNodeSuccess.type, payload: data });
  } catch (e) {
    yield put({
      type: resignMasterNodeFailure.type,
      payload: getErrorMessage(e),
    });
    log.error(e);
  }
}

export function* handleRestartNode() {
  const {
    createdMasterNodeData: { masternodeOperator, masternodeOwner },
  } = yield select((state) => state.masterNodes);
  try {
    if (isElectron()) {
      const data = yield call(getAddressInfo, masternodeOwner);
      if (data.ismine && !data.iswatchonly) {
        const updatedConf = yield call(getConfigurationDetails);
        updatedConf.masternode_operator = masternodeOperator;
        updatedConf.masternode_owner = masternodeOwner;
        yield put(restartModal());
        yield call(shutDownBinary);
        yield call(restartNode, { updatedConf });
        yield put(finishRestartNodeWithMasterNode());
      } else
        throw new Error(
          I18n.t('alerts.addressIsNotAPartOfWallet', {
            addressName: 'masternodeOperator',
          })
        );
    } else throw new Error(I18n.t('alerts.electronRequiredError'));
  } catch (e) {
    yield put({
      type: createMasterNodeFailure.type,
      payload: getErrorMessage(e),
    });
    log.error(e);
  }
}
export function* checkMasterNodeOwnerInfo(action) {
  try {
    const {
      payload: { masterNodeOwner },
    } = action;
    const data = yield call(getAddressInfo, masterNodeOwner);
    yield put({
      type: setMasterNodeOwnerSuccess.type,
      payload: data.ismine && !data.iswatchonly,
    });
  } catch (e) {
    yield put({
      type: setMasterNodeOwnerError.type,
      payload: getErrorMessage(e),
    });
    log.error(e);
  }
}

function* mySaga() {
  yield takeLatest(fetchMasternodesRequest.type, fetchMasterNodes);
  yield takeLatest(createMasterNode.type, createMasterNodes);
  yield takeLatest(resignMasterNode.type, masterNodeResign);
  yield takeLatest(startRestartNodeWithMasterNode.type, handleRestartNode);
  yield takeLatest(setMasterNodeOwner.type, checkMasterNodeOwnerInfo);
}

export default mySaga;
