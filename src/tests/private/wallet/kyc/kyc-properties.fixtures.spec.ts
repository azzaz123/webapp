import { KYCProperties } from '@api/core/model/kyc-properties/interfaces/kyc-properties.interface';
import { KYC_FLOW_STATUS } from '@api/core/model/kyc-properties/kyc-flow-status.enum';
import { KYC_REFUSED_REASON } from '@api/core/model/kyc-properties/kyc-refused-reason.enum';
import { KYC_STATUS } from '@api/core/model/kyc-properties/kyc-status.enum';
import { KYCPropertiesApi, KYCRefusedReasonApi } from '@api/payments/kyc-properties/dtos/responses';

const MOCK_KYC_PROPERTIES_API: KYCPropertiesApi = {
  inflow_status: 'blocked',
  outflow_status: 'blocked',
  document_refused_reason_type: null,
  user_kyc_status: 'rejected',
};

export const MOCK_KYC_REJECTED_PROPERTIES_API: KYCPropertiesApi = {
  ...MOCK_KYC_PROPERTIES_API,
  document_refused_reason_type: 'document unreadable',
  user_kyc_status: 'rejected',
};

export const MOCK_KYC_REJECTED_PROPERTIES_UNKOWN_REFUSED_REASON_API: KYCPropertiesApi = {
  ...MOCK_KYC_PROPERTIES_API,
  document_refused_reason_type: 'disjdijsidjisdis' as KYCRefusedReasonApi,
  user_kyc_status: 'rejected',
};

export const MOCK_KYC_PENDING_PROPERTIES_API: KYCPropertiesApi = {
  ...MOCK_KYC_PROPERTIES_API,
  user_kyc_status: 'pending',
};

export const MOCK_KYC_NO_NEED_PROPERTIES_API: KYCPropertiesApi = {
  ...MOCK_KYC_PROPERTIES_API,
  user_kyc_status: 'no need',
};

export const MOCK_KYC_PENDING_PROPERTIES: KYCProperties = {
  status: KYC_STATUS.PENDING,
  refusedReason: null,
  inflowStatus: KYC_FLOW_STATUS.UNBLOCKED,
  outflowStatus: KYC_FLOW_STATUS.UNBLOCKED,
};

export const MOCK_KYC_VERIFIED_PROPERTIES: KYCProperties = {
  status: KYC_STATUS.VERIFIED,
  refusedReason: null,
  inflowStatus: KYC_FLOW_STATUS.UNBLOCKED,
  outflowStatus: KYC_FLOW_STATUS.UNBLOCKED,
};

export const MOCK_KYC_NO_NEED_PROPERTIES: KYCProperties = {
  status: KYC_STATUS.NO_NEED,
  refusedReason: null,
  inflowStatus: KYC_FLOW_STATUS.UNBLOCKED,
  outflowStatus: KYC_FLOW_STATUS.UNBLOCKED,
};

export const MOCK_KYC_PENDING_VERIFICATION_PROPERTIES: KYCProperties = {
  status: KYC_STATUS.PENDING_VERIFICATION,
  refusedReason: null,
  inflowStatus: KYC_FLOW_STATUS.UNBLOCKED,
  outflowStatus: KYC_FLOW_STATUS.UNBLOCKED,
};

export const MOCK_KYC_ERROR_PROPERTIES: KYCProperties = {
  status: KYC_STATUS.REJECTED,
  refusedReason: {
    reason: KYC_REFUSED_REASON.DOCUMENT_DO_NOT_MATCH_ACCOUNT_DATA,
    translation: 'lluís l2p',
  },
  inflowStatus: KYC_FLOW_STATUS.UNBLOCKED,
  outflowStatus: KYC_FLOW_STATUS.UNBLOCKED,
};
