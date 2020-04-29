import axios from "axios";
import store from "../app/rootStore";

export default class RpcClient {
  client: any;
  constructor() {
    const state = store.getState();
    this.client = axios.create({
      baseURL: `http://${state.app.rpcAuth}@${state.app.rpcConnect}:${state.app.rpcPort}`,
      headers: {
        "cache-control": "no-cache",
      },
    });
  }

  call = async (path: string, method: string, params: Array<any> = []) => {
    return await this.client.post(path, {
      jsonrpc: "1.0",
      id: Math.random()
        .toString()
        .substr(2),
      method,
      params,
    });
  };

  // Common calls
  // getinfo = async () => {
  //   return this.call("getblockcount");
  // };
}
