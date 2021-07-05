/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * User clicks on add credit card
 */
export interface ClickSubscriptionAddCard {
  /**
   * Identifier of the screen where the click is done
   */
  screenId: 241;
  /**
   * Whether the subscription offers free trial
   */
  freeTrial?: boolean;
  /**
   * Subscription category type that reached the limit
   */
  subscription?: 0 | 100 | 200 | 14000 | 12800;
}
