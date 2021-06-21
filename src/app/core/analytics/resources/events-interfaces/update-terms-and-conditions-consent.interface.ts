/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Collects consent status to user terms and conditions when asking for it for existing users with a pop-up
 */
export interface UpdateTermsAndConditionsConsent {
  /**
   * User's consent based on the response on the popup
   */
  consent: boolean;
  /**
   * Terms and Conditions version
   */
  version: number;
}