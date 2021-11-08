/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * The payment is approved and a request is sent to the seller
 */
export interface TransactionPaymentSuccess {
  /**
   * The unique identifier for an item
   */
  itemId: string;
  /**
   * Payment method the user has selected
   */
  paymentMethod: 'bank card' | 'wallet' | 'wallet, bank card' | 'paypal' | 'wallet, paypal';
  /**
   * Id of the shipping request
   */
  requestId?: string;
  /**
   * Identifier of the checkout screen
   */
  screenId: 238;
  /**
   * Country of the user (buyer) that sends the transaction payment success (e.g.: ES, IT, etc.)
   */
  country?: string;
  /**
   * Language of the user (buyer) that sends the transaction payment success(e.g.: ES, IT, etc.)
   */
  language?: string;
  /**
   * ISO currency code of the price of the item
   */
  currency?: 'EUR';
  /**
   * Test group of the user
   */
  experiment?: 'payments_3dspopup_control' | 'payments_3dspopup_variant';
}
