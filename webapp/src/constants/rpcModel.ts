export interface AccountAmountModel {
  [key: string]: number;
}

export interface AccountOwnerModel {
  asm: string;
  hex: string;
  reqSigs: number;
  type: string;
  addresses: string[];
}

export interface AccountKeyItem {
  address: string;
  hash: string;
}

export interface AccountModel {
  key: string;
  owner: AccountOwnerModel;
  amount: AccountAmountModel;
}

export interface BytesModel {
  feefilter: number;
  getheaders: number;
  ping: number;
  pong: number;
  headers: number;
  sendcmpct: number;
  sendheaders: number;
  verack: number;
  version: number;
}

export interface BytesSentModel extends BytesModel {
  getaddr: number;
}

export interface BytesReceiveModel extends BytesModel {
  addr: number;
  inv: number;
}

export interface PeerInfoModel {
  id: number;
  addr: string;
  addrlocal: string;
  addrbind: string;
  services: string;
  servicesnames: string[];
  relaytxes: boolean;
  lastsend: number;
  lastrecv: number;
  bytessent: number;
  bytesrecv: number;
  conntime: number;
  timeoffset: number;
  pingtime: number;
  minping: number;
  version: number;
  subver: string;
  inbound: boolean;
  addnode: boolean;
  startingheight: number;
  banscore: number;
  synced_headers: number;
  synced_blocks: number;
  inflight: number[];
  whitelisted: boolean;
  minfeefilter: number;
  bytessent_per_msg: BytesSentModel;
  bytesrecv_per_msg: BytesReceiveModel;
}
