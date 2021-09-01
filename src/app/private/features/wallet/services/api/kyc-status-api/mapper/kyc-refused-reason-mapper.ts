import { KYC_REFUSED_REASONS } from '../../../../enums/kyc-refused-reasons.enum';

export function getRefusedReason(documentRefusedReason: string): KYC_REFUSED_REASONS {
  switch (documentRefusedReason) {
    case 'unknown':
      return KYC_REFUSED_REASONS.UNKNOWN;
    case 'document unreadable':
      return KYC_REFUSED_REASONS.DOCUMENT_UNREADABLE;
    case 'document not accepted':
      return KYC_REFUSED_REASONS.DOCUMENT_NOT_ACCEPTED;
    case 'document has expired':
      return KYC_REFUSED_REASONS.DOCUMENT_EXPIRED;
    case 'document incomplete':
      return KYC_REFUSED_REASONS.DOCUMENT_INCOMPLETE;
    case 'document do not match user data':
      return KYC_REFUSED_REASONS.DOCUMENT_DO_NOT_MATCH_USER_DATA;
    case 'document do not match account data':
      return KYC_REFUSED_REASONS.DOCUMENT_DO_NOT_MATCH_ACCOUNT_DATA;
    case 'document falsified':
      return KYC_REFUSED_REASONS.DOCUMENT_FALSIFIED;
    case 'underage person':
      return KYC_REFUSED_REASONS.UNDERAGE_PERSON;
    case 'specific case':
      return KYC_REFUSED_REASONS.SPECIFIC_CASE;
    default:
      return KYC_REFUSED_REASONS.UNKNOWN;
  }
}
