/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * The transaction is successful and the seller has received the money for the transaction. Event sent for the buyer
 */
export interface TransactionSucceededBuyer {
  /**
   * The unique identifier for an item
   */
  itemId: string;
  /**
   * Identifier of the shipping request
   */
  requestId: string;
  /**
   * Identifier of the transaction
   */
  transactionId: string;
}
