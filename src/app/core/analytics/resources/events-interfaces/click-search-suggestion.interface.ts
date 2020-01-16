/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * User clicks on a suggestion in order to perform the search once they have written the text they want to search. This event is sampled to a 5% with the condition mod(deviceid, 20) = 0. In android the deviceid will be the androidid
 */
export interface ClickSearchSuggestion {
  /**
   * Text typed by the user in the search bubble
   */
  searchText: string;
  /**
   * Suggestion the user has clicked on
   */
  suggestion: string;
  /**
   * Identifier of the screen in which the user has clicked on the keyboard search button
   */
  screenId: 111;
}
