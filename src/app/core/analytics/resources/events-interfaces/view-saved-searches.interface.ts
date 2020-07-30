/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * User views the section of saved searches
 */
export interface ViewSavedSearches {
  /**
   * Identifier of my saved searches section screen
   */
  screenId: 224;
  /**
   * Number of different saved searches the user has in the my saved searches section
   */
  numberOfSavedSearches: number;
  /**
   * Number of inactive saved searches the user has in the my saved searches section
   */
  numberOfInactiveSavedSearches: number;
  /**
   * Number of saved searches with 0 hits the user has in the my saved searches section
   */
  numberOfSavedSearchesWithZeroHits: number;
  /**
   * Total number of hits in the my saved searches section
   */
  numberOfHits: number;
}
