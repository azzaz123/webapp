/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Users clicks on a verification option on the verifications and security screen
 */
export interface ClickVerificationOption {
  /**
   * Identifier of the screen of the register help center
   */
  screenId: 248 | 110;
  /**
   * Identifier of the verification done
   */
  verificationMethod: 'phone' | 'email' | 'facebook';
  /**
   * If the user click on change email or not
   */
  change?: boolean;
}
