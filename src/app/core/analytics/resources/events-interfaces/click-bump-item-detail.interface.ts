/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * User clicks on the bump button of an item detail page
 */
export interface ClickBumpItemDetail {
  /**
   * If the item clicked is from a professional user
   */
  isPro: boolean;
  /**
   * The unique identifier for an item
   */
  itemId: string;
  /**
   * Identifier of the category that the item belongs to
   */
  categoryId: number;
  /**
   * Item price without fees
   */
  itemPrice: number;
  /**
   * Item title
   */
  title: string;
  /**
   * Identifier of the screen that the item was clicked from
   */
  screenId: 114;
}
