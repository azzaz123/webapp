/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * View own reviews screen
 */
export interface ViewOwnReviews {
  /**
   * Identifier of the view own reviews screen
   */
  screenId: 234;
  /**
   * If the user profile is a pro user
   */
  isPro: boolean;
  /**
   * Number of reviews
   */
  numberOfReviews?: number;
  /**
   * Reviews score
   */
  reviewsScore?: number;
  /**
   * Name of the experiment or A/B testing applied to the user who has performed the view. The default value would be 'baseline'
   */
  experiment?: string;
}
