import store from '../src/app/rootStore';
import { getRpcConfigsSuccess } from '../src/containers/RpcConfiguration/reducer';
store.dispatch({
  type: getRpcConfigsSuccess.type,
  payload: {
    remotes: [
      {
        rpcuser: 'a',
        rpcpassword: 'b',
        rpcconnect: '127.0.0.1',
        rpcport: '18443',
      },
    ],
  },
});
