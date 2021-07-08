/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * User clicks confirm edit current subscription button
 */
export interface ClickConfirmEditCurrentSubscription {
  /**
   * Subscription category type
   */
  subscription: 0 | 100 | 14000 | 12800;
  /**
   * Tier of the subscription before the edit
   */
  previousTier: string;
  /**
   * Tier of the subscription after the edit
   */
  newTier: string;
  /**
   * Identifier of the screen
   */
  screenId: 206;
}
