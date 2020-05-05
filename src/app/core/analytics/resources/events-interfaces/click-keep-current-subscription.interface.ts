/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * User clicks keep current subscription on a previously canceled subscription
 */
export interface ClickKeepCurrentSubscription {
  /**
   * Subscription category type
   */
  subscription: 0 | 100 | 14000 | 12800;
  /**
   * Tier of the subscription canceled
   */
  tier: string;
  /**
   * Identifier of the screen
   */
  screenId: 206;
}
