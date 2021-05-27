/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * User successfully registers
 */
export interface RegisterSuccess {
  /**
   * Identifier of the verification done
   */
  registrationMethod: 'email' | 'google' | 'facebook' | 'apple';
  /**
   * If the user has given consent for communications
   */
  communicationsConsent: boolean;
}
