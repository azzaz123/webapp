export interface KYCPropertiesApi {
  inflow_status: KYCFlowStatusApi;
  outflow_status: KYCFlowStatusApi;
  user_kyc_status: KYCDocumentStatusApi;
  document_refused_reason_type: KYCRefusedReasonApi | null;
}

export type KYCFlowStatusApi = 'blocked' | 'unblocked';

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
