/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * User edits an uploaded product (in consumer goods)
 */
export interface EditItemCG {
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
   * If the item edited is from a professional user
   */
  isPro: boolean;
  /**
   * Identifier of the screen that the item was edited from
   */
  screenId: 162;
}
