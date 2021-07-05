/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * User views KYC review documentation image screen
 */
export interface ViewKYCReviewDocumentationImageScreen {
  /**
   * Identifier of the user viewing KYC review documentation image screen
   */
  userId?: string;
  /**
   * Chosen type of document on the KYC upload identity verification screen (Passport - Residence permit - Driving license - National Identity card)
   */
  typeOfDocument: 'passport' | 'residence_permit' | 'driving_license' | 'national_identity_card';
  /**
   * Identifier of the KYC review documentation image screen
   */
  screenId: 201;
}
