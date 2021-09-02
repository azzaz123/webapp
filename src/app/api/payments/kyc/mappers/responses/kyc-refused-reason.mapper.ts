import { KYC_REFUSED_REASON } from '@api/core/model/kyc-status/kyc-refused-reason.enum';
import { KYCRefusedReasonApi } from '@api/payments/kyc-status/dtos/responses';

export function mapKYCRefusedReason(documentRefusedReason: KYCRefusedReasonApi): KYC_REFUSED_REASON {
  switch (documentRefusedReason) {
    case 'document unreadable':
      return KYC_REFUSED_REASON.DOCUMENT_UNREADABLE;
    case 'document not accepted':
      return KYC_REFUSED_REASON.DOCUMENT_NOT_ACCEPTED;
    case 'document has expired':
      return KYC_REFUSED_REASON.DOCUMENT_EXPIRED;
    case 'document incomplete':
      return KYC_REFUSED_REASON.DOCUMENT_INCOMPLETE;
    case 'document do not match user data':
      return KYC_REFUSED_REASON.DOCUMENT_DO_NOT_MATCH_USER_DATA;
    case 'document do not match account data':
      return KYC_REFUSED_REASON.DOCUMENT_DO_NOT_MATCH_ACCOUNT_DATA;
    case 'document falsified':
      return KYC_REFUSED_REASON.DOCUMENT_FALSIFIED;
    case 'underage person':
      return KYC_REFUSED_REASON.UNDERAGE_PERSON;
    case 'specific case':
      return KYC_REFUSED_REASON.SPECIFIC_CASE;
    case 'unknown':
    default:
      return KYC_REFUSED_REASON.UNKNOWN;
  }
}
