import { KYCProperties } from '@api/core/model/kyc-properties/interfaces/kyc-properties.interface';
import { KYC_REFUSED_REASON } from '@api/core/model/kyc-properties/kyc-refused-reason.enum';
import { KYC_STATUS } from '@api/core/model/kyc-properties/kyc-status.enum';
import { KYCPropertiesApi } from '@api/payments/kyc-properties/dtos/responses';

const MOCK_KYC_PROPERTIES_API: KYCPropertiesApi = {
  document_id: '1234',
  document_refused_reason_type: null,
  document_status: 'rejected',
  mangopay_user_kyc_id: '2344',
};

export const MOCK_KYC_REJECTED_PROPERTIES_API: KYCPropertiesApi = {
  ...MOCK_KYC_PROPERTIES_API,
  document_refused_reason_type: 'document unreadable',
  document_status: 'rejected',
};

export const MOCK_KYC_PENDING_PROPERTIES_API: KYCPropertiesApi = {
  ...MOCK_KYC_PROPERTIES_API,
  document_status: 'pending',
};

export const MOCK_KYC_NO_NEED_PROPERTIES_API: KYCPropertiesApi = {
  ...MOCK_KYC_PROPERTIES_API,
  document_status: 'no need',
};

export const MOCK_KYC_PENDING_PROPERTIES: KYCProperties = {
  status: KYC_STATUS.PENDING,
  refusedReason: null,
  documentId: '123',
  mangopayUserId: '123',
};

export const MOCK_KYC_ERROR_PROPERTIES: KYCProperties = {
  status: KYC_STATUS.REJECTED,
  refusedReason: {
    reason: KYC_REFUSED_REASON.DOCUMENT_DO_NOT_MATCH_ACCOUNT_DATA,
    translation: 'lluís l2p',
  },
  documentId: '123',
  mangopayUserId: '123',
};
