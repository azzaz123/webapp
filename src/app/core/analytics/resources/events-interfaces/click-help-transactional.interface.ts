/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * User clicks a help or information button to find transactional info on any screen
 */
export interface ClickHelpTransactional {
  /**
   * The unique identifier for an item
   */
  itemId?: string;
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
  isBuyNow?: boolean;
  /**
   * Item price without fees
   */
  itemPrice?: number;
  /**
   * Identifier of the user that the item belongs to
   */
  sellerUserId: string;
  /**
   * Identifier of the screen where the click is done
   */
  screenId: 210 | 238 | 41 | 27 | 302 | 316 | 311 | 312 | 313;
  /**
   * Name of the tutorial/help that the user is clicking on
   */
  helpName:
    | 'Help Top Pay Screen'
    | 'Help Top Accept Screen'
    | 'Help Shipping Upload Screen'
    | 'Learn More Chat Screen'
    | 'Shipping FAQs'
    | 'Multi-step Logistics Screen'
    | 'Multi-step Payment Screen'
    | 'Multi-step Summary Screen';
}
