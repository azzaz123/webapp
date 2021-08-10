/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Users starts the unlinking process by clicking on unlink facebook, google or apple on the popup
 */
export interface StartUnlinkSocialAccountProcess {
  /**
   * Identifier of verifications and security screen
   */
  screenId: 248;
  /**
   * Identifier of the account type that is going to be unlinked
   */
  method: 'facebook' | 'google' | 'apple';
  /**
   * If the user has email verified
   */
  emailVerified: boolean;
}