import { KYCRefusedErrorTranslations } from '@private/features/wallet/enums/kyc-refused-error-translations';
import { KYCRefusedReasonProperty } from '../interfaces/kyc-refused-reason-property.interface';
import { KYC_REFUSED_REASON } from '../kyc-refused-reason.enum';

export const KYC_REFUSED_REASON_PROPERTIES: KYCRefusedReasonProperty[] = [
  {
    reason: KYC_REFUSED_REASON.DOCUMENT_UNREADABLE,
    translation: KYCRefusedErrorTranslations.DOCUMENT_UNREADABLE,
  },
  {
    reason: KYC_REFUSED_REASON.DOCUMENT_NOT_ACCEPTED,
    translation: KYCRefusedErrorTranslations.DOCUMENT_NOT_ACCEPTED,
  },
  {
    reason: KYC_REFUSED_REASON.DOCUMENT_EXPIRED,
    translation: KYCRefusedErrorTranslations.DOCUMENT_EXPIRED,
  },
  {
    reason: KYC_REFUSED_REASON.DOCUMENT_INCOMPLETE,
    translation: KYCRefusedErrorTranslations.DOCUMENT_INCOMPLETE,
  },
  {
    reason: KYC_REFUSED_REASON.DOCUMENT_DO_NOT_MATCH_USER_DATA,
    translation: KYCRefusedErrorTranslations.DOCUMENT_DO_NOT_MATCH_USER_DATA,
  },
  {
    reason: KYC_REFUSED_REASON.DOCUMENT_DO_NOT_MATCH_ACCOUNT_DATA,
    translation: KYCRefusedErrorTranslations.DOCUMENT_DO_NOT_MATCH_ACCOUNT_DATA,
  },
  {
    reason: KYC_REFUSED_REASON.DOCUMENT_FALSIFIED,
    translation: KYCRefusedErrorTranslations.DOCUMENT_FALSIFIED,
  },
  {
    reason: KYC_REFUSED_REASON.UNDERAGE_PERSON,
    translation: KYCRefusedErrorTranslations.UNDERAGE_PERSON,
  },
  {
    reason: KYC_REFUSED_REASON.SPECIFIC_CASE,
    translation: KYCRefusedErrorTranslations.SPECIFIC_CASE,
  },
  {
    reason: KYC_REFUSED_REASON.UNKNOWN,
    translation: KYCRefusedErrorTranslations.UNKNOWN,
  },
];
