/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Users successfully login for the first time
 */
export interface FirstLogin {
  /**
   * Identifier of the login method used
   */
  loginMethod: 'apple' | 'google' | 'facebook' | 'email';
}
