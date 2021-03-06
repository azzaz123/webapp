/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * User views accept offer screen
 */
export interface ViewAcceptOffer {
  /**
   * The unique identifier for an item
   */
  itemId: string;
  /**
   * Identifier of the user interested in the item
   */
  buyerUserId: string;
  /**
   * Identifier of the transaction request
   */
  requestId: string;
  /**
   * Identifier of the category that the transaction item belongs to
   */
  categoryId: number;
  /**
   * If the item is from a professional user
   */
  isPro?: boolean;
  /**
   * Item total price
   */
  totalPrice: number;
  /**
   * Item offered price
   */
  offeredPrice: number;
  /**
   * Item price without fees
   */
  itemPrice: number;
  /**
   * Item title
   */
  title: string;
  /**
   * Identifier of the accept offer screen
   */
  screenId: 210;
  /**
   * Drop off method
   */
  method?: 'correos' | 'HPU';
  /**
   * Real country of the buyer's shipping address (using 2-digit ISO Code)
   */
  buyerCountry: string;
}
