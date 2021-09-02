export interface KYCStatusApi {
  document_id: string;
  document_refused_reason_type: KYCRefusedReason;
  document_status: KYCDocumentStatus;
  mangopay_user_kyc_id: string;
}

export type KYCRefusedReason =
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

export type KYCDocumentStatus = 'pending' | 'pending verification' | 'verified' | 'rejected' | 'no need';
