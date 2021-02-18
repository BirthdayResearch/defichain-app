export interface IPCResponseModel<T> {
  success: boolean;
  data?: T;
  message?: string;
}
