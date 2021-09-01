export interface KYCStatusApi {
  document_id: string;
  document_refused_reason_type: string;
  document_status: string;
  mangopay_user_kyc_id: string;
}
