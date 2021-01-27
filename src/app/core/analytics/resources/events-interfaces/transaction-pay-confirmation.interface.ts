/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * User have clicked on the pay button to buy an item through shipping and once the external form (about the banck info) is validated, the event is sent. This is equivalent to a shipping request
 */
export interface TransactionPayConfirmation {
  /**
   * The unique identifier for an item
   */
  itemId: string;
  /**
   * Identifier of the category that the item belongs to
   */
  categoryId: number;
  /**
   * The unique identifier of the search that the click on the pay transaction button is under
   */
  searchId?: string;
  /**
   * If the transaction request comes from the buy now button or from transaction banner of the chat screen
   */
  isBuyNow: boolean;
  /**
   * Identifier of the screen that the item was clicked from
   */
  screenId: 209;
  /**
   * Identifier of the user that the item belongs to
   */
  sellerUserId: string;
  /**
   * Offered price by the user. Even if the user does not offer a different price, this attribute will be sent with the same price than the itemPrice. In the Buy Now flow, the offered price will always the same than the itemPrice
   */
  offeredPrice: number;
  /**
   * Item price without fees
   */
  itemPrice: number;
  /**
   * If the item is a bumped item
   */
  isBumped?: boolean;
  /**
   * If the item is from a professional user
   */
  isPro?: boolean;
  /**
   * Balance amount in the wallet
   */
  balanceAmount?: number;
  /**
   * Whether the buyer uses the balance in the wallet to pay
   */
  useBalance?: boolean;
}
