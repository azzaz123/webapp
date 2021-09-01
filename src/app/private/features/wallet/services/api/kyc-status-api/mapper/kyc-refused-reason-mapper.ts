import { KYC_REFUSED_REASON } from '../../../../enums/kyc-refused-reason.enum';

export function mapKYCRefusedReason(documentRefusedReason: string): KYC_REFUSED_REASON {
  switch (documentRefusedReason) {
    case 'unknown':
      return KYC_REFUSED_REASON.UNKNOWN;
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
    default:
      return KYC_REFUSED_REASON.UNKNOWN;
  }
}
