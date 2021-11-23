/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * User scrolls the wall recommendation slider
 */
export interface ScrollWallRecommendationSlider {
  /**
   * The unique identifier of the browsing
   */
  searchId: string;
  /**
   * Recommended categories in the wall recommendation slider separated by comma
   */
  categoriesInWallRecommendationSlider?: string;
  /**
   * Recommended subcategories in the wall recommendation slider separated by comma
   */
  subcategoriesInWallRecommendationSlider?: string;
  /**
   * Identifier of the screen that the item was clicked from
   */
  screenId: 110;
  /**
   * Name of the experiment or A/B testing applied to the user who has scrolled the wall recommendation slider. The default value would be 'baseline'
   */
  experiment?: string;
}
