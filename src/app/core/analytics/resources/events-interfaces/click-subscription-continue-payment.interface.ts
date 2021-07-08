/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * User clicks continue payment button after selecting subscription
 */
export interface ClickSubscriptionContinuePayment {
  /**
   * Subscription category type
   */
  subscription: 0 | 100 | 200 | 14000 | 12800;
  /**
   * Identifier of the subscription tier
   */
  tier: string;
  /**
   * If the user is a new or recurrent subscriber
   */
  isNewSubscriber: boolean;
  /**
   * Identifier of the Profile Subscription screen
   */
  screenId: 206;
}
