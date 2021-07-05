/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Users views of the WordPress affiliation landing
 */
export interface ViewAffiliationLanding {
  /**
   * Identifier of the pro subscription limit popup screen
   */
  screenId: 258;
  /**
   * Url of the landing where the affiliation partner button was clicked
   */
  landingUrl: string;
  /**
   * The unique identifier of the item where the affiliation button was clicked
   */
  itemId?: string;
  /**
   * Name of the experiment or A/B testing applied to the user who click the affiliation partner button. The default value would be 'baseline'
   */
  experiment?: string;
}
