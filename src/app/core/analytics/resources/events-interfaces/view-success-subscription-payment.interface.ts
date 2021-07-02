/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * User views the success subscription payment screen
 */
export interface ViewSuccessSubscriptionPayment {
  /**
   * Subscription category type
   */
  subscription: 0 | 100 | 14000 | 12800;
  /**
   * Tier of the subscription
   */
  tier: string;
  /**
   * If the user is a new or recurrent subscriber
   */
  isNewSubscriber: boolean;
  /**
   * The users introduce a new card
   */
  isNewCard: boolean;
  /**
   * Identifier of the screen
   */
  screenId: 206;
}
