/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * The register form contains errors and Backend answers to the client with an error message
 */
export interface RegisterFormError {
  /**
   * The name and surname the user has introduced in the register form
   */
  NameAndSurname?: string;
  /**
   * The email address the user has introduced
   */
  emailAddress: string;
  /**
   * The error message that has caused the register form to fail
   */
  errorMessage: string;
  /**
   * Identifier of the screen of the register form
   */
  screenId: 221;
}
