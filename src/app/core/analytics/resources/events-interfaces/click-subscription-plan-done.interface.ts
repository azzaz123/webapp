/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * User clicks on done button after subscription selection
 */
export interface ClickSubscriptionPlanDone {
  /**
   * Identifier of the Subscription Management screen
   */
  screenId: 191;
  /**
   * Subscription category type
   */
  subscription: 0 | 100 | 200 | 14000 | 12800;
  /**
   * Identifier of the previous subscription tier purchased
   */
  previousTier: string;
  /**
   * Identifier of the new subscription tier purchased
   */
  newTier: string;
}
