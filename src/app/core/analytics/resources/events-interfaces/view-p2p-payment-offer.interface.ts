/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Buyer views P2P payment success screen
 */
export interface ViewP2PPaymentOffer {
  /**
   * Identifier of P2P Payment Offer screen
   */
  screenId: 299;
  /**
   * Payment amount offered
   */
  paymentAmount: number;
  /**
   * Hashed id of the item
   */
  itemId: string;
  /**
   * Hashed id of the buyer
   */
  buyerUserId: string;
}
