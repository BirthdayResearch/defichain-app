import { call, put, takeLatest, select, delay } from 'redux-saga/effects';
import * as log from '../../utils/electronLogger';
import remove from 'lodash/remove';
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
  return configurationData.trim().split('\n');
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
        const dataArr = yield call(getConfigurationDetails);
        remove(dataArr, (item: string) =>
          item.includes('masternode_operator=')
        );
        remove(dataArr, (item: string) => item.includes('masternode_owner='));
        dataArr.push(
          `masternode_operator=${createdMasterNodeData.masternodeOperator}`
        );
        dataArr.push(
          `masternode_owner=${createdMasterNodeData.masternodeOwner}`
        );

        const finalString = dataArr.join('\n');
        yield put(restartModal());
        yield call(q.kill);
        yield call(restartNode, { updatedConf: finalString });
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
  const configDetails = yield call(getConfigurationDetails);
  const isMasterNode = configDetails.find((item) =>
    item.includes('masternode_operator=')
  );
  const address = isMasterNode?.substring('masternode_operator='.length);
  try {
    if (address) {
      yield call(getPrivateKey, address);
      yield put(setMasternodeOperator(address));
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
