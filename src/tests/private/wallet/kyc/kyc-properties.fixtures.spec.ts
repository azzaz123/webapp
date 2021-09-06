import { KYCProperties } from '@api/core/model/kyc-properties/interfaces/kyc-properties.interface';
import { KYC_REFUSED_REASON } from '@api/core/model/kyc-properties/kyc-refused-reason.enum';
import { KYC_STATUS } from '@api/core/model/kyc-properties/kyc-status.enum';
import { KYCPropertiesApi } from '@api/payments/kyc-properties/dtos/responses';

export const MOCK_KYC_REJECTED_PROPERTIES_API: KYCPropertiesApi = {
  document_id: '1234',
  document_refused_reason_type: 'document unreadable',
  document_status: 'rejected',
  mangopay_user_kyc_id: '2344',
};

export const MOCK_KYC_BANNER_PENDING_VERIFICATION: KYCProperties = {
  status: KYC_STATUS.PENDING_VERIFICATION,
  refusedReason: null,
  documentId: '',
  mangopayUserId: '',
};

export const MOCK_KYC_BANNER_PENDING: KYCProperties = {
  status: KYC_STATUS.PENDING,
  refusedReason: null,
  documentId: '',
  mangopayUserId: '',
};

export const MOCK_KYC_BANNER_REJECTED: KYCProperties = {
  status: KYC_STATUS.REJECTED,
  refusedReason: { reason: KYC_REFUSED_REASON.DOCUMENT_DO_NOT_MATCH_ACCOUNT_DATA, translation: '' },
  documentId: '',
  mangopayUserId: '',
};

export const MOCK_KYC_BANNER_VERIFIED: KYCProperties = {
  status: KYC_STATUS.VERIFIED,
  refusedReason: null,
  documentId: '',
  mangopayUserId: '',
};

export const MOCK_KYC_BANNER_NO_NEED: KYCProperties = {
  status: KYC_STATUS.NO_NEED,
  refusedReason: null,
  documentId: '',
  mangopayUserId: '',
};
