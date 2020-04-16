/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * User clicks the confirmation payment on the subcription web flow
 */
export interface SubscriptionPayConfirmation {
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
   * Discount applied to the subscritpion in percent
   */
  discountPercent?: number;
  /**
   * Identifier of the screen
   */
  screenId: 207;
}
