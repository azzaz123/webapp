export const KYCRefusedErrorTranslations = {
  UNKNOWN: $localize`:@@kyc_failed_modal_unknown_error_description:For some reason, we don't have any ID registered for you. Please repeat the verification process.`,
  DOCUMENT_UNREADABLE: $localize`:@@kyc_failed_modal_if_document_unreadable_description:Some parts of your document's photo are unreadable. Repeat the photo, please.`,
  DOCUMENT_NOT_ACCEPTED: $localize`:@@kyc_failed_modal_if_document_not_accepted_description:The document you provided is not accepted to verify your identity. Please upload a proper document.`,
  DOCUMENT_EXPIRED: $localize`:@@kyc_failed_modal_if_document_has_expired_description:The document you provided has either expired, is not up to date, or is valid for less than 3 months.`,
  DOCUMENT_INCOMPLETE: $localize`:@@kyc_failed_modal_if_document_incomplete_description:Some parts of your document's photo are cut off. Repeat the photo, please.  `,
  DOCUMENT_DO_NOT_MATCH_USER_DATA: $localize`:@@kyc_failed_modal_if_document_dont_match_user_data_description:The name on the document does not match the bank details provided. To verify your identity, the ID document must belong to the bank account holder.`,
  DOCUMENT_DO_NOT_MATCH_ACCOUNT_DATA: $localize`:@@kyc_failed_modal_if_document_dont_match_account_data_description:The name on the document does not match the bank details provided. To verify your identity, the ID document must belong to the bank account holder.`,
  DOCUMENT_FALSIFIED: $localize`:@@kyc_failed_modal_if_document_is_false_description:The document you have provided is fake. Please provide an authentic document.`,
  UNDERAGE_PERSON: $localize`:@@kyc_failed_modal_if_underage_person_description:The document you provided corresponds to a minor.`,
  SPECIFIC_CASE: $localize`:@@kyc_failed_modal_if_specific_case_description:For some reason, identity verification has been rejected.`,
};
