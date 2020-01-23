/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * User views transactional timeline screen
 */
export interface ViewTransactionalTimeline {
  /**
   * The unique identifier for an item
   */
  itemId: string;
  /**
   * Identifier of the user interested in the item
   */
  buyerUserId: string;
  /**
   * Identifier of the user that the item belongs to
   */
  sellerUserId: string;
  /**
   * Identifier of the transaction request
   */
  requestId: string;
  /**
   * Identifier of the category that the transaction item belongs to
   */
  categoryId: number;
  /**
   * Status of the transaction
   */
  status:
    | "request_created"
    | "request_rejected"
    | "transaction_created"
    | "request_expired"
    | "item_delivered"
    | "transaction_payment_failed"
    | "request_failed"
    | "tag_created"
    | "item_in_transit"
    | "item_delivered_to_carrier"
    | "money_transferred"
    | "shipping_failed"
    | "transaction_expired"
    | "transaction_cancelled"
    | "transaction_cancelled_by_seller"
    | "item_available_for_the_recipient"
    | "dispute_updated";
  /**
   * Identifier of the transaction timeline screen
   */
  screenId: 205;
}
