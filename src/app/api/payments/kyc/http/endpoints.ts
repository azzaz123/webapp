import { environment } from '@environments/environment';

const KYC_API_URL = 'api/v3/payments/kyc';

export const REQUEST_KYC_ENDPOINT = `${environment.baseUrl}${KYC_API_URL}/documents`;
export const KYC_STATUS_ENDPOINT = `${environment.baseUrl}${KYC_API_URL}`;
