import { KYC_STATUS_STATES } from '@api/core/model/kyc/kyc-status-states.enum';
import { KYCStatus } from '@api/core/model/kyc/kyc-status.interface';
import { KYCDocumentStatus, KYCStatusApi } from '../../dtos/responses';
import { mapKYCRefusedReason } from './kyc-refused-reason.mapper';

export function mapKYCStatusApiToKYCStatus(KYCStatusApi: KYCStatusApi): KYCStatus {
  return {
    status: getDocumentStatus(KYCStatusApi.document_status),
    refusedReason: KYCStatusApi.document_refused_reason_type ? mapKYCRefusedReason(KYCStatusApi.document_refused_reason_type) : null,
    documentId: KYCStatusApi.document_id,
    mangopayUserId: KYCStatusApi.mangopay_user_kyc_id,
  };
}

function getDocumentStatus(status: KYCDocumentStatus): KYC_STATUS_STATES {
  if (status === 'pending') return KYC_STATUS_STATES.PENDING;
  if (status === 'pending verification') return KYC_STATUS_STATES.PENDING_VERIFICATION;
  if (status === 'verified') return KYC_STATUS_STATES.VERIFIED;
  if (status === 'rejected') return KYC_STATUS_STATES.REJECTED;
  return KYC_STATUS_STATES.NO_NEED;
}
