import { KYC_REFUSED_REASON_PROPERTIES } from '@api/core/model/kyc-properties/constants/kyc-refused-reasons-constants';
import { KYCProperties } from '@api/core/model/kyc-properties/interfaces/kyc-properties.interface';
import { KYCRefusedReasonProperty } from '@api/core/model/kyc-properties/interfaces/kyc-refused-reason-property.interface';
import { KYC_STATUS } from '@api/core/model/kyc-properties/kyc-status.enum';
import { KYCDocumentStatusApi, KYCPropertiesApi, KYCRefusedReasonApi } from '@api/payments/kyc-properties/dtos/responses';

export function mapKYCPropertiesApiToKYCProperties(KYCPropertiesApi: KYCPropertiesApi): KYCProperties {
  return {
    status: getDocumentStatus(KYCPropertiesApi.document_status),
    refusedReason: getRefusedReason(KYCPropertiesApi.document_refused_reason_type),
    documentId: KYCPropertiesApi.document_id,
    mangopayUserId: KYCPropertiesApi.mangopay_user_kyc_id,
  };
}

function getRefusedReason(refusedReasonApi: KYCRefusedReasonApi): KYCRefusedReasonProperty {
  return KYC_REFUSED_REASON_PROPERTIES.find((properties) => properties.reason === refusedReasonApi);
}

function getDocumentStatus(definedStatus: KYCDocumentStatusApi): KYC_STATUS {
  return Object.values(KYC_STATUS).find((status) => status === definedStatus);
}
