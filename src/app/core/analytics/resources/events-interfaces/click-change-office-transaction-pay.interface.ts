/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * User clicks change pot office button after selecting O2O method in the transaction pay screen
 */
export interface ClickChangeOfficeTransactionPay {
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
   * If the transacion is Buy Now or not
   */
  isBuyNow: boolean;
  /**
   * Item price without fees
   */
  itemPrice: number;
  /**
   * Identifier of the user that the item belongs to
   */
  sellerUserId: string;
  /**
   * Identifier of the screen where the click is done
   */
  screenId: 209;
}
