/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Users favorites product
 */
export interface FavoriteItem {
  /**
   * The unique identifier for an item
   */
  itemId: string;
  /**
   * Identifier of the category that the item belongs to
   */
  categoryId?: number;
  /**
   * Identifier of the screen that the item was favorited from
   */
  screenId: number;
  /**
   * The unique identifier of the search that the favorite is under
   */
  searchId?: string;
  /**
   * If the item favorited is from a professional user
   */
  isPro?: boolean;
  /**
   * Item price
   */
  salePrice: number;
  /**
   * Item title
   */
  title: string;
}
