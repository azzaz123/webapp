import { FinancialCard, SabadellInfoResponse } from '../app/core/payments/payment.interface';

export const FINANCIAL_CARD: FinancialCard = {
  expire_date: 61598188800000,
  id: '06553101-a47d-45cb-b4e0-6f9d8e89014b',
  number: '1234***********1111'
};

export const SABADELL_RESPONSE: SabadellInfoResponse = {
  merchant_parameters: 'eyJEU19NRVJDSEFOVF9BTU9VTlQi',
  signature: '/XvjPsRtYubYTmKLCGkpA6XxOXj/rJ3sdGZl0+gz3lw=',
  signature_version: 'HMAC_SHA256_V1',
  target_url: 'https://sis-t.redsys.es:25443/sis/realizarPago'
};
