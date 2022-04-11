/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Users views item detail screen for a consumer goods item
 */
export interface ViewOthersItemCGDetail {
  /**
   * The unique identifier for an item
   */
  itemId: string;
  /**
   * Identifier of the category that the item belongs to
   */
  categoryId: number;
  /**
   * Item price
   */
  salePrice: number;
  /**
   * Item title
   */
  title: string;
  /**
   * If the seller of the item viewed is a professional user
   */
  isPro: boolean;
  /**
   * Identifier of the screen that the item was viewed from
   */
  screenId: number;
  /**
   * Identifier of the state of the view
   */
  state?: string;
  /**
   * Country of the item/seller (e.g.: ES, IT, etc.) using 2-digit ISO Code
   */
  sellerCountry: string;
  /**
   * Name of the experiment or A/B testing applied to the user who has viewed the item detail. The default value would be 'baseline'
   */
  experiment?: string;
  /**
   * Whether the shipping toggle is activated for the item (buyer can send shipping request)
   */
  shippingAllowed?: boolean;
}
