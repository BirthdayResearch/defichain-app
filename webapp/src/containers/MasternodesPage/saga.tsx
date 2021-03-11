import { call, put, takeLatest, select, all } from 'redux-saga/effects';
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
  updateMasternodeStart,
} from './reducer';
import {
  openMasternodeUpdateRestartModal,
  restartModal,
} from '../PopOver/reducer';
import {
  handleFetchMasterNodes,
  handelCreateMasterNodes,
  handleResignMasterNode,
  getAddressInfo,
  isMasternodeEnabled,
  disableMasternodesMining,
} from './service';

import {
  getErrorMessage,
  remapNodeError,
  getNetworkType,
} from '../../utils/utility';

import { isElectron, restartNodeSync } from '../../utils/isElectron';
import { MASTER_NODES_PATH, RESIGNED_STATE } from '../../constants';
import { MasterNodeObject } from './masterNodeInterface';
import store from '../../app/rootStore';
import { history } from '../../utils/history';
import MasternodesPage from '.';
import { RootState } from '../../app/rootTypes';

export function* getConfigurationDetails() {
  const { rpcConfig } = yield select((state: RootState) => state.app);
  const data = cloneDeep(rpcConfig);
  if (isEmpty(data)) {
    throw new Error('Unable to fetch configuration file');
  }
  return data;
}

export function* fetchMasterNodes() {
  try {
    const data: MasterNodeObject[] = yield call(handleFetchMasterNodes);
    const enabledMasternode = data.filter(
      (masterNode) => masterNode.state !== RESIGNED_STATE
    );
    const masternodes: MasterNodeObject[] = [];
    for (const iterator of enabledMasternode) {
      try {
        const result: MasterNodeObject = yield call(
          MasterNodeOwnerInfo,
          iterator
        );
        result.isEnabled = result.isMyMasternode
          ? yield call(isMasternodeEnabled, result)
          : true;
        masternodes.push(result);
      } catch (err) {
        log.error(err.message);
      }
    }
    yield put({
      type: fetchMasternodesSuccess.type,
      payload: { masternodes },
    });
  } catch (e) {
    const message = remapNodeError(getErrorMessage(e));
    yield put({
      type: fetchMasternodesFailure.type,
      payload: message,
    });
    log.error(message);
  }
}

export function* createMasterNodes() {
  try {
    const data = yield call(handelCreateMasterNodes);
    yield put({ type: createMasterNodeSuccess.type, payload: { ...data } });
  } catch (e) {
    const message = remapNodeError(getErrorMessage(e));
    yield put({
      type: createMasterNodeFailure.type,
      payload: message,
    });
    log.error(message);
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
    const message = remapNodeError(getErrorMessage(e));
    yield put({
      type: resignMasterNodeFailure.type,
      payload: message,
    });
    log.error(message);
  }
}

export function* handleRestartNode() {
  const network = getNetworkType();
  const {
    createdMasterNodeData: { masternodeOperator, masternodeOwner },
  } = yield select((state) => state.masterNodes);
  try {
    if (isElectron()) {
      const data = yield call(getAddressInfo, masternodeOwner);
      if (data.ismine && !data.iswatchonly) {
        const updatedConf = yield call(getConfigurationDetails);
        const networkConf = updatedConf[network] || {};
        const ENABLE_CONFIG = 1;
        updatedConf[network] = {
          ...networkConf,
          masternode_operator: networkConf?.masternode_operator
            ? [...networkConf.masternode_operator, masternodeOperator]
            : [masternodeOperator],
          spv: ENABLE_CONFIG,
          gen: ENABLE_CONFIG,
        };
        yield put(restartModal());
        yield call(shutDownBinary);
        yield call(restartNodeSync, { updatedConf });
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

function* MasterNodeOwnerInfo(masterNode: MasterNodeObject) {
  const data = yield call(getAddressInfo, masterNode.ownerAuthAddress);
  return {
    ...masterNode,
    isMyMasternode: data.ismine && !data.iswatchonly,
  };
}

function* handleUpdateMasternodeStart() {
  try {
    const { popover } = store.getState();
    const updatedConf = yield call(
      disableMasternodesMining,
      popover.updatedMasternode as MasterNodeObject
    );
    yield put(restartModal());
    yield call(shutDownBinary);
    yield call(restartNodeSync, { updatedConf });
    yield put(
      openMasternodeUpdateRestartModal({ isOpen: false, masternode: null })
    );
    history.push(MASTER_NODES_PATH);
  } catch (e) {
    const message = remapNodeError(getErrorMessage(e));
    yield put(
      openMasternodeUpdateRestartModal({ isOpen: false, masternode: null })
    );
    log.error(message);
  }
}

function* mySaga() {
  yield takeLatest(fetchMasternodesRequest.type, fetchMasterNodes);
  yield takeLatest(createMasterNode.type, createMasterNodes);
  yield takeLatest(resignMasterNode.type, masterNodeResign);
  yield takeLatest(startRestartNodeWithMasterNode.type, handleRestartNode);
  yield takeLatest(updateMasternodeStart.type, handleUpdateMasternodeStart);
}

export default mySaga;
