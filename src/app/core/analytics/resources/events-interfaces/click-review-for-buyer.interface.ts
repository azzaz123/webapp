/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * User starts review flow for a buyer
 */
export interface ClickReviewForBuyer {
  /**
   * Identifier of the screen where the flow was started from
   */
  screenId: 27;
  /**
   * Hashed Identifier of the item
   */
  itemId: string;
  /**
   * Hashed Identifier of the user the seller selects as the buyer
   */
  buyerUserId: string;
}
