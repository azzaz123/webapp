/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * User views the section of own sold items
 */
export interface ViewOwnSoldItems {
  /**
   * Identifier of my sold items section screen
   */
  screenId: 239;
  /**
   * Number of sold items
   */
  numberOfItems?: number;
  /**
   * Flag true or false is the view shows an empty state
   */
  emptyState?: boolean;
  /**
   * Name of the experiment or A/B testing applied to the user who has viewed the sold items section of sold items.
   */
  experiment?: string;
}
