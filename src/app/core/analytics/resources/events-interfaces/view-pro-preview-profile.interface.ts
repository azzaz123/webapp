/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Users view the preview profile of a Pro user after clicking on the Top Seller card (from the slider shown in the wall or search results page)
 */
export interface ViewProPreviewProfile {
  /**
   * UserId of the pro user whose profile is being previewed
   */
  proUserId: string;
  /**
   * Identifier of the screen where the preview of the pro profile is being seen
   */
  screenId: 188;
  /**
   * The unique identifier of the search
   */
  searchId: string;
  /**
   * Name of the experiment or A/B testing applied to the user who has performed the view. The default value would be 'baseline'
   */
  experiment?: string;
}
