/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * User uploads a RealEstate product
 */
export interface ListItemRE {
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
   * Real State Operation
   */
  operation?: string;
  /**
   * Real State Property Type
   */
  type?: string;
  /**
   * Real State condition
   */
  condition?: string;
  /**
   * Real State surface area
   */
  surface?: number;
  /**
   * Real State number of rooms
   */
  rooms?: number;
  /**
   * If the item clicked is from a professional user
   */
  isPro: boolean;
  /**
   * Identifier of the screen that the item was uploaded from
   */
  screenId: number;
  /**
   * Hashtags
   */
  hashtags?: string;
}
