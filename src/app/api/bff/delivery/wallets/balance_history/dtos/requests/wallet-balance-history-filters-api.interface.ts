type HttpClientQueryParams = { [param: string]: string | string[] };

export interface WalletBalanceHistoryQueryParamsApi extends HttpClientQueryParams {
  page: string;
  type?: 'IN' | 'OUT';
}
