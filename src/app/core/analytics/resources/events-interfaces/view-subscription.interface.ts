/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * User views subscription screen (to purchase or manage subscriptions)
 */
export interface ViewSubscription {
  /**
   * Identifier of the Subscription screen
   */
  screenId: 191;
  /**
   * All the subscription category ids that are shown as free trial in ascending order
   */
  freeTrialSubscriptions?: string;
  /**
   * Whether the user is a PRO
   */
  isPro: boolean;
  /**
   * The source that takes the user to the subscription page
   */
  source?: 'landing_banner' | 'landing_details';
}
