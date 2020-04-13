import { call, put, takeLatest } from "redux-saga/effects";
import {
  fetchMasternodesRequest,
  fetchMasternodesSuccess,
  fetchMasternodesFailure,
} from "./reducer";

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

function* fetchMasterNodes() {
  try {
    const data = yield call(handelFetchMasterNodes);
    if (data && data.masternodes) {
      yield put({ type: fetchMasternodesSuccess.type, payload: { ...data } });
    } else {
      yield put({
        type: fetchMasternodesFailure.type,
        payload: "No data found",
      });
    }
  } catch (e) {
    yield put({ type: fetchMasternodesFailure.type, payload: e.message });
    console.log(e);
  }
}

function handelFetchMasterNodes() {
  const data = {
    masternodes: [
      {
        id: 0,
        status: "confirmed",
        address: "c9a59be5d9f453229f519ab3c5289c",
        pose: "0",
        registered: "1201065",
        lastPaid: "1201065",
        nextPayment: "1201065",
        payee: "XitNe4kuhgmvn7eKn6orLrnbg6h6JUaSvG",
      },
      {
        id: 1,
        status: "confirmed",
        address: "c9a59be5d9f453229f519ab3c5289c",
        pose: "0",
        registered: "1201065",
        lastPaid: "1201065",
        nextPayment: "1201065",
        payee: "XitNe4kuhgmvn7eKn6orLrnbg6h6JUaSvG",
      },
      {
        id: 2,
        status: "confirmed",
        address: "c9a59be5d9f453229f519ab3c5289c",
        pose: "0",
        registered: "1201065",
        lastPaid: "1201065",
        nextPayment: "1201065",
        payee: "XitNe4kuhgmvn7eKn6orLrnbg6h6JUaSvG",
      },
      {
        id: 3,
        status: "confirmed",
        address: "c9a59be5d9f453229f519ab3c5289c",
        pose: "0",
        registered: "1201065",
        lastPaid: "1201065",
        nextPayment: "1201065",
        payee: "XitNe4kuhgmvn7eKn6orLrnbg6h6JUaSvG",
      },
      {
        id: 4,
        status: "confirmed",
        address: "c9a59be5d9f453229f519ab3c5289c",
        pose: "0",
        registered: "1201065",
        lastPaid: "1201065",
        nextPayment: "1201065",
        payee: "XitNe4kuhgmvn7eKn6orLrnbg6h6JUaSvG",
      },
      {
        id: 5,
        status: "confirmed",
        address: "c9a59be5d9f453229f519ab3c5289c",
        pose: "0",
        registered: "1201065",
        lastPaid: "1201065",
        nextPayment: "1201065",
        payee: "XitNe4kuhgmvn7eKn6orLrnbg6h6JUaSvG",
      },
      {
        id: 6,
        status: "confirmed",
        address: "c9a59be5d9f453229f519ab3c5289c",
        pose: "0",
        registered: "1201065",
        lastPaid: "1201065",
        nextPayment: "1201065",
        payee: "XitNe4kuhgmvn7eKn6orLrnbg6h6JUaSvG",
      },
      {
        id: 7,
        status: "confirmed",
        address: "c9a59be5d9f453229f519ab3c5289c",
        pose: "0",
        registered: "1201065",
        lastPaid: "1201065",
        nextPayment: "1201065",
        payee: "XitNe4kuhgmvn7eKn6orLrnbg6h6JUaSvG",
      },
      {
        id: 8,
        status: "confirmed",
        address: "c9a59be5d9f453229f519ab3c5289c",
        pose: "0",
        registered: "1201065",
        lastPaid: "1201065",
        nextPayment: "1201065",
        payee: "XitNe4kuhgmvn7eKn6orLrnbg6h6JUaSvG",
      },
      {
        id: 9,
        status: "confirmed",
        address: "c9a59be5d9f453229f519ab3c5289c",
        pose: "0",
        registered: "1201065",
        lastPaid: "1201065",
        nextPayment: "1201065",
        payee: "XitNe4kuhgmvn7eKn6orLrnbg6h6JUaSvG",
      },
      {
        id: 10,
        status: "confirmed",
        address: "c9a59be5d9f453229f519ab3c5289c",
        pose: "0",
        registered: "1201065",
        lastPaid: "1201065",
        nextPayment: "1201065",
        payee: "XitNe4kuhgmvn7eKn6orLrnbg6h6JUaSvG",
      },
      {
        id: 11,
        status: "confirmed",
        address: "c9a59be5d9f453229f519ab3c5289c",
        pose: "0",
        registered: "1201065",
        lastPaid: "1201065",
        nextPayment: "1201065",
        payee: "XitNe4kuhgmvn7eKn6orLrnbg6h6JUaSvG",
      },
      {
        id: 12,
        status: "confirmed",
        address: "c9a59be5d9f453229f519ab3c5289c",
        pose: "0",
        registered: "1201065",
        lastPaid: "1201065",
        nextPayment: "1201065",
        payee: "XitNe4kuhgmvn7eKn6orLrnbg6h6JUaSvG",
      },
      {
        id: 13,
        status: "confirmed",
        address: "c9a59be5d9f453229f519ab3c5289c",
        pose: "0",
        registered: "1201065",
        lastPaid: "1201065",
        nextPayment: "1201065",
        payee: "XitNe4kuhgmvn7eKn6orLrnbg6h6JUaSvG",
      },
      {
        id: 14,
        status: "confirmed",
        address: "c9a59be5d9f453229f519ab3c5289c",
        pose: "0",
        registered: "1201065",
        lastPaid: "1201065",
        nextPayment: "1201065",
        payee: "XitNe4kuhgmvn7eKn6orLrnbg6h6JUaSvG",
      },
      {
        id: 15,
        status: "confirmed",
        address: "c9a59be5d9f453229f519ab3c5289c",
        pose: "0",
        registered: "1201065",
        lastPaid: "1201065",
        nextPayment: "1201065",
        payee: "XitNe4kuhgmvn7eKn6orLrnbg6h6JUaSvG",
      },
      {
        id: 16,
        status: "confirmed",
        address: "c9a59be5d9f453229f519ab3c5289c",
        pose: "0",
        registered: "1201065",
        lastPaid: "1201065",
        nextPayment: "1201065",
        payee: "XitNe4kuhgmvn7eKn6orLrnbg6h6JUaSvG",
      },
      {
        id: 17,
        status: "confirmed",
        address: "c9a59be5d9f453229f519ab3c5289c",
        pose: "0",
        registered: "1201065",
        lastPaid: "1201065",
        nextPayment: "1201065",
        payee: "XitNe4kuhgmvn7eKn6orLrnbg6h6JUaSvG",
      },
      {
        id: 18,
        status: "confirmed",
        address: "c9a59be5d9f453229f519ab3c5289c",
        pose: "0",
        registered: "1201065",
        lastPaid: "1201065",
        nextPayment: "1201065",
        payee: "XitNe4kuhgmvn7eKn6orLrnbg6h6JUaSvG",
      },
      {
        id: 19,
        status: "confirmed",
        address: "c9a59be5d9f453229f519ab3c5289c",
        pose: "0",
        registered: "1201065",
        lastPaid: "1201065",
        nextPayment: "1201065",
        payee: "XitNe4kuhgmvn7eKn6orLrnbg6h6JUaSvG",
      },
      {
        id: 20,
        status: "confirmed",
        address: "c9a59be5d9f453229f519ab3c5289c",
        pose: "0",
        registered: "1201065",
        lastPaid: "1201065",
        nextPayment: "1201065",
        payee: "XitNe4kuhgmvn7eKn6orLrnbg6h6JUaSvG",
      },
      {
        id: 21,
        status: "confirmed",
        address: "c9a59be5d9f453229f519ab3c5289c",
        pose: "0",
        registered: "1201065",
        lastPaid: "1201065",
        nextPayment: "1201065",
        payee: "XitNe4kuhgmvn7eKn6orLrnbg6h6JUaSvG",
      },
    ],
  };
  return data;
}

function* mySaga() {
  yield takeLatest(fetchMasternodesRequest.type, fetchMasterNodes);
}

export default mySaga;
