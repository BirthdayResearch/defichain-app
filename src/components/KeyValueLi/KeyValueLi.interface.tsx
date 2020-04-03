export interface KeyValueLiState {
  copied: Boolean;
  qrOpen: Boolean;
}

export interface KeyValueLiProps {
  copyable?: boolean | string;
  value?: string;
  popsQR?: any;
  uid?: any;
  label?: string;
}
