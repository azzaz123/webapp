/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Users share an item
 */
export interface ShareItem {
  /**
   * The unique identifier for an item
   */
  itemId: string;
  /**
   * Identifier of the category that the item belongs to
   */
  categoryId: number;
  /**
   * Channel through which the item has been shared
   */
  channel: 'facebook' | 'messenger' | 'email' | 'whatsapp' | 'twitter' | 'others';
  /**
   * Identifier of the screen that the item was shared from
   */
  screenId: 114 | 115 | 189;
  /**
   * If the item shared is from a professional user
   */
  isPro?: boolean;
  /**
   * Item price
   */
  salePrice: number;
  /**
   * Whether the shipping toggle is activated for the item (buyer can send shipping request)
   */
  shippingAllowed?: boolean;
}
