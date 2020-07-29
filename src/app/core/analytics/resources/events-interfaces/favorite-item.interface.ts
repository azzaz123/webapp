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
  screenId: 110 | 111 | 29 | 188 | 190 | 194 | 115 | 217;
  /**
   * The unique identifier of the search that the favorite is under
   */
  searchId?: string;
  /**
   * If the item favorited is from a professional user
   */
  isPro: boolean;
  /**
   * Item price
   */
  salePrice: number;
  /**
   * Item title
   */
  title: string;
  /**
   * Identifier of the user that the item belongs to
   */
  sellerUserId?: string;
  /**
   * If the item favorited is a bumped item
   */
  isBumped: boolean;
  /**
   * When the event is triggered in SavedSearchesNewVsOld screen (217), specify if it is in the 'new' results or 'old'
   */
  savedSearchResults?: string;
}
