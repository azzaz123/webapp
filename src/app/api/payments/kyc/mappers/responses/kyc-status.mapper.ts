import { KYC_STATUS } from '@api/core/model/kyc-properties/kyc-status.enum';
import { KYCProperties } from '@api/core/model/kyc-properties/kyc-properties.interface';
import { KYCDocumentStatus, KYCPropertiesApi } from '@api/payments/kyc-status/dtos/responses';
import { mapKYCRefusedReason } from './kyc-refused-reason.mapper';

export function mapKYCPropertiesApiToKYCProperties(KYCPropertiesApi: KYCPropertiesApi): KYCProperties {
  return {
    status: getDocumentStatus(KYCPropertiesApi.document_status),
    refusedReason: KYCPropertiesApi.document_refused_reason_type
      ? mapKYCRefusedReason(KYCPropertiesApi.document_refused_reason_type)
      : null,
    documentId: KYCPropertiesApi.document_id,
    mangopayUserId: KYCPropertiesApi.mangopay_user_kyc_id,
  };
}

function getDocumentStatus(status: KYCDocumentStatus): KYC_STATUS {
  if (status === 'pending') return KYC_STATUS.PENDING;
  if (status === 'pending verification') return KYC_STATUS.PENDING_VERIFICATION;
  if (status === 'verified') return KYC_STATUS.VERIFIED;
  if (status === 'rejected') return KYC_STATUS.REJECTED;
  return KYC_STATUS.NO_NEED;
}
