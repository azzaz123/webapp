/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * User clicks on the PRO subscription button in his profile page or in the top sellers slider on the Wall
 */
export interface ClickProSubscription {
  /**
   * If the view offers free trial or not
   */
  freeTrial?: boolean;
  /**
   * Identifier of the screen in which the user has clicked
   */
  screenId: 111 | 112 | 219;
}
