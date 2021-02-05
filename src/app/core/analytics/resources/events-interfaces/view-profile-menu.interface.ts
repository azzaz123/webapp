/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * View own profile menu screen
 */
export interface ViewProfileMenu {
  /**
   * Identifier of the view own profile menu screen
   */
  screenId: 233;
  /**
   * If the user is a pro user
   */
  isPro?: boolean;
  /**
   * Name of the experiment or A/B testing applied to the user who has performed the view. The default value would be 'baseline'
   */
  experiment?: string;
}