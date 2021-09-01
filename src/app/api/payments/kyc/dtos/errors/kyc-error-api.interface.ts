export interface KYCErrorApi<T = string> {
  error_code: T;
  message: string;
}
