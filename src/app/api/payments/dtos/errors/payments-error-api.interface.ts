export interface PaymentsErrorApi<T = string> {
  error_code: T;
  message: string;
}
