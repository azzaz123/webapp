/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * System event triggered for the seller when the delivery fails
 */
export interface TransactionDeliveryFailedSeller {
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