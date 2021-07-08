/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * User clicks one of the shipping info drop downs in item detail
 */
export interface ClickShippingInfoItem {
  /**
   * The unique identifier for an item
   */
  itemId: string;
  /**
   * Identifier of the category that the item belongs to
   */
  categoryId: number;
  /**
   * The unique identifier of the search that the click is under
   */
  searchId?: string;
  /**
   * If the item clicked is from a professional user
   */
  isPro?: boolean;
  /**
   * Item price without fees
   */
  itemPrice: number;
  /**
   * Item title
   */
  title: string;
  /**
   * Identifier of the drop down item the user has clicked
   */
  dropDownId: 1 | 2 | 3;
  /**
   * Identifier of the screen that the item was clicked from
   */
  screenId: 115;
}
