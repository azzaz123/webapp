export interface FinancialCard {
  expire_date: number;
  id: string;
  number: string;
}

export interface SabadellInfoResponse {
  merchant_parameters: string;
  signature: string;
  signature_version: string;
  target_url: string;
}
