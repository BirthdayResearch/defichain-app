import { call, put, takeLatest, select, delay } from 'redux-saga/effects';
import * as log from '../../utils/electronLogger';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import { I18n } from 'react-redux-i18n';
import q from '../../worker/queue';
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
  setMasternodeOperator,
} from './reducer';
import { restartModal } from '../ErrorModal/reducer';
import {
  handelFetchMasterNodes,
  handelCreateMasterNodes,
  handleResignMasterNode,
  getPrivateKey,
  importPrivateKey,
} from './service';

import { restartNode, isElectron } from '../../utils/isElectron';

function* getConfigurationDetails() {
  const { configurationData } = yield select((state) => state.app);
  const data = cloneDeep(configurationData);
  if (isEmpty(data)) {
    throw new Error('Unable to fetch configuration file');
  }
  return data;
}

function* fetchMasterNodes() {
  yield call(masterNodeOperator);
  try {
    const data = yield call(handelFetchMasterNodes);
    if (data && Array.isArray(data)) {
      yield put({
        type: fetchMasternodesSuccess.type,
        payload: { masternodes: data },
      });
    } else {
      yield put({
        type: fetchMasternodesFailure.type,
        payload: 'No data found',
      });
    }
  } catch (e) {
    yield put({ type: fetchMasternodesFailure.type, payload: e.message });
    log.error(e);
  }
}

function* createMasterNodes(action) {
  try {
    const {
      payload: { masterNodeName },
    } = action;
    const data = yield call(handelCreateMasterNodes, masterNodeName);
    yield put({ type: createMasterNodeSuccess.type, payload: { ...data } });
  } catch (e) {
    yield put({ type: createMasterNodeFailure.type, payload: e.message });
    log.error(e);
  }
}

function* masterNodeResign(action) {
  try {
    const {
      payload: { masterNodeHash },
    } = action;
    const data = yield call(handleResignMasterNode, masterNodeHash);
    yield put({ type: resignMasterNodeSuccess.type, payload: data });
  } catch (e) {
    yield put({ type: resignMasterNodeFailure.type, payload: e.message });
    log.error(e);
  }
}

function* handleRestartNode() {
  const { createdMasterNodeData } = yield select((state) => state.masterNodes);
  try {
    if (isElectron()) {
      if (createdMasterNodeData) {
        const privKey = yield call(
          getPrivateKey,
          createdMasterNodeData.masternodeOperator
        );
        yield call(importPrivateKey, privKey);
        const updatedConf = yield call(getConfigurationDetails);
        updatedConf.masternode_operator =
          createdMasterNodeData.masternodeOperator;
        updatedConf.masternode_owner = createdMasterNodeData.masternodeOwner;
        yield put(restartModal());
        yield call(q.kill);
        yield call(restartNode, { updatedConf });
        yield delay(2000);
        yield put(finishRestartNodeWithMasterNode());
      } else throw new Error('Unable to get location of config file');
    } else throw new Error('Electron app is needed for restart');
  } catch (e) {
    yield put({ type: createMasterNodeFailure.type, payload: e.message });
    log.error(e);
  }
}

function* masterNodeOperator() {
  const configData = yield call(getConfigurationDetails);
  try {
    if (configData.masternode_operator) {
      yield call(getPrivateKey, configData.masternode_operator);
      yield put(setMasternodeOperator(configData.masternode_operator));
    } else {
      throw new Error(I18n.t('alerts.masterNodeOperatorAddressFailure'));
    }
  } catch (e) {
    yield put(setMasternodeOperator(''));
    log.error(e);
  }
}

function* mySaga() {
  yield takeLatest(fetchMasternodesRequest.type, fetchMasterNodes);
  yield takeLatest(createMasterNode.type, createMasterNodes);
  yield takeLatest(resignMasterNode.type, masterNodeResign);
  yield takeLatest(startRestartNodeWithMasterNode.type, handleRestartNode);
}

export default mySaga;
