/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * System event when user didn’t finish the bump purchase or there was an error
 */
export interface BumpPurchaseCancelled {
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
   * Type of bump selected (urgent, local, city, national)
   */
  bumpType: "urgent" | "local" | "city" | "national";
  /**
   * Number of days ofbump duration selected (2, 7, 15 days)
   */
  bumpDays: 2 | 7 | 15 | 30;
  /**
   * Identifier of the screen that the item was clicked from
   */
  screenId: 213;
}
