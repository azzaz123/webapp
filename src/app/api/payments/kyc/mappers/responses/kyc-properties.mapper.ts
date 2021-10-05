import { KYC_REFUSED_REASONS } from '@api/core/model/kyc-properties/constants/kyc-refused-reasons-constants';
import { KYCProperties } from '@api/core/model/kyc-properties/interfaces/kyc-properties.interface';
import { KYCRefusedReason } from '@api/core/model/kyc-properties/interfaces/kyc-refused-reason.interface';
import { KYC_FLOW_STATUS } from '@api/core/model/kyc-properties/kyc-flow-status.enum';
import { KYC_STATUS } from '@api/core/model/kyc-properties/kyc-status.enum';
import { KYCDocumentStatusApi, KYCFlowStatusApi, KYCPropertiesApi, KYCRefusedReasonApi } from '@api/payments/kyc-properties/dtos/responses';

export function mapKYCPropertiesApiToKYCProperties(KYCPropertiesApi: KYCPropertiesApi): KYCProperties {
  return {
    status: getDocumentStatus(KYCPropertiesApi.user_kyc_status),
    refusedReason: getRefusedReason(KYCPropertiesApi.document_refused_reason_type),
    inflowStatus: getFlowStatus(KYCPropertiesApi.inflow_status),
    outflowStatus: getFlowStatus(KYCPropertiesApi.outflow_status),
  };
}

function getRefusedReason(refusedReasonApi: KYCRefusedReasonApi): KYCRefusedReason {
  return refusedReasonApi ? KYC_REFUSED_REASONS.find((properties) => properties.reason === refusedReasonApi) : null;
}

function getDocumentStatus(definedStatus: KYCDocumentStatusApi): KYC_STATUS {
  return Object.values(KYC_STATUS).find((status) => status === definedStatus);
}
function getFlowStatus(definedStatus: KYCFlowStatusApi): KYC_FLOW_STATUS {
  return Object.values(KYC_FLOW_STATUS).find((status) => status === definedStatus);
}
