export enum KYC_REFUSED_REASON {
  UNKNOWN = 'unknown',
  DOCUMENT_UNREADABLE = 'document unreadable',
  DOCUMENT_NOT_ACCEPTED = 'document not accepted',
  DOCUMENT_EXPIRED = 'document has expired',
  DOCUMENT_INCOMPLETE = 'document incomplete',
  DOCUMENT_DO_NOT_MATCH_USER_DATA = 'document do not match user data',
  DOCUMENT_DO_NOT_MATCH_ACCOUNT_DATA = 'document do not match account data',
  DOCUMENT_FALSIFIED = 'document falsified',
  UNDERAGE_PERSON = 'underage person',
  SPECIFIC_CASE = 'specific case',
}
