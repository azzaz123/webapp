export interface KYCPropertiesApi {
  document_id: string;
  document_refused_reason_type: KYCRefusedReasonApi;
  document_status: KYCDocumentStatusApi;
  mangopay_user_kyc_id: string;
}

export type KYCRefusedReasonApi =
  | 'unknown'
  | 'document unreadable'
  | 'document not accepted'
  | 'document has expired'
  | 'document incomplete'
  | 'document do not match user data'
  | 'document do not match account data'
  | 'document falsified'
  | 'underage person'
  | 'specific case';

export type KYCDocumentStatusApi = 'pending' | 'pending verification' | 'verified' | 'rejected' | 'no need';
