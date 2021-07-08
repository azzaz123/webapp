/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * User reactivate an item
 */
export interface ReactivateItem {
  /**
   * The unique identifier for an item
   */
  itemId: string;
  /**
   * Identifier of the category that the item belongs to
   */
  categoryId: number;
  /**
   * Identifier of the subcategory that the item belongs to
   */
  subcategoryId?: number;
  /**
   * Item price
   */
  salePrice?: number;
  /**
   * Item title
   */
  title: string;
  /**
   * Brand
   */
  brand?: string;
  /**
   * Model
   */
  model?: string;
  /**
   * CG Object type name
   */
  objectType?: string;
  /**
   * If the item is from a professional user
   */
  isPro: boolean;
  /**
   * Identifier of the screen that the item was reactivated from
   */
  screenId: number;
  /**
   * Hashtags
   */
  hashtags?: string;
  /**
   * If the item has the shipping toggle on
   */
  shippingAllowed?: boolean;
  /**
   * If the item has the weight informed
   */
  shippingWeight?: number;
}
