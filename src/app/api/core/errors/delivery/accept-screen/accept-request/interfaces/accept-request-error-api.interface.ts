export interface AcceptRequestErrorApi<T = string> {
  error_code: T;
  field: ACCEPT_REQUEST_ERROR_FIELD;
  message: string;
}

export enum ACCEPT_REQUEST_ERROR_FIELD {
  SELLER_ADDRESS,
  SELECTED_CARRIER,
  NONE,
}
