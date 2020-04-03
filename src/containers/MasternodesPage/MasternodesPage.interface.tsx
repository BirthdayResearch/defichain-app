export interface MasternodesPageProps {}
export interface MasternodesPageState {
  activeTab: string;
  searching: boolean;
}

export interface MasternodesListProps {}
export interface MasternodesListState {
  masternodes: Array<{
    id: number;
    status: String;
    address: String;
    pose: String;
    registered: String;
    lastPaid: String;
    nextPayment: String;
    payee: String;
  }>;
}
