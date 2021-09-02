import { KYCDocumentStatus, KYCStatusApi } from '@private/features/wallet/interfaces/kyc/kyc-status-api.interface';
import { KYCStatus, KYC_STATUS } from '@private/features/wallet/interfaces/kyc/kyc-status.interface';
import { mapKYCRefusedReason } from './kyc-refused-reason-mapper';

export function mapKYCStatusApiToKYCStatus(KYCStatusApi: KYCStatusApi): KYCStatus {
  return {
    status: getStatus(KYCStatusApi.document_status),
    refusedReason: KYCStatusApi.document_refused_reason_type ? mapKYCRefusedReason(KYCStatusApi.document_refused_reason_type) : null,
    documentId: KYCStatusApi.document_id,
    mangopayUserId: KYCStatusApi.mangopay_user_kyc_id,
  };
}

function getStatus(status: KYCDocumentStatus): KYC_STATUS {
  if (status === 'pending') return KYC_STATUS.PENDING;
  if (status === 'pending verification') return KYC_STATUS.PENDING_VERIFICATION;
  if (status === 'verified') return KYC_STATUS.VERIFIED;
  if (status === 'rejected') return KYC_STATUS.REJECTED;
  return KYC_STATUS.NO_NEED;
}
