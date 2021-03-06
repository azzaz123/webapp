/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * User views the section of favorite searches
 */
export interface ViewFavoriteSearches {
  /**
   * Identifier of my favorite searches section screen
   */
  screenId: 323;
  /**
   * Number of different favorite searches the user has in the my favorite searches section, 0 if there is none
   */
  numberOfFavoriteSearches?: number;
  /**
   * Number of inactive favorite searches the user has in the my favorite searches section
   */
  numberOfInactiveFavoriteSearches?: number;
  /**
   * Number of favorite searches with 0 hits the user has in the my favorite searches section
   */
  numberOfFavoriteSearchesWithoutNewResults?: number;
  /**
   * Flag true or false is the view shows an empty state, which is shown only to unlogged users
   */
  emptyState?: boolean;
  /**
   * Name of the experiment or A/B testing applied to the user who has viewed the favorite searches section.
   */
  experiment?: string;
}
