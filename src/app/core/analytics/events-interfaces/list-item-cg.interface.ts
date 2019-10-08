/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * User uploads a ConsumerGoods product
 */
export interface ListItemCG {
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
  salePrice?: number;
  /**
   * Item title
   */
  title: string;
  /**
   * CG Brand
   */
  brand?: string;
  /**
   * CG Model
   */
  model?: string;
  /**
   * CG Object type name
   */
  objectType?: string;
  /**
   * If the item clicked is from a professional user
   */
  isPro: boolean;
  /**
   * Identifier of the screen that the item was uploaded from
   */
  screenId: number;
}
