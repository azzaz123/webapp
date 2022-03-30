/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * There is a problem or an error with the payment request
 */
export interface TransactionCheckoutError {
  /**
   * The unique identifier for an item
   */
  itemId: string;
  /**
   * Balance amount in the wallet
   */
  walletBalanceAmount?: number;
  /**
   * Payment method the user has selected
   */
  paymentMethod?: 'bank card' | 'wallet' | 'wallet, bank card' | 'paypal' | 'wallet, paypal';
  /**
   * Short description of the error
   */
  errorType:
    | 'unknown error'
    | 'payment failed'
    | 'cancel payment'
    | 'address missing'
    | 'saving payment preferences failed'
    | 'sending 3DS info failed'
    | 'address not supported'
    | 'payment information missing'
    | 'promocode not valid';
  /**
   * Identifier of the checkout screen
   */
  screenId: 238 | 311 | 312 | 313;
  /**
   * Test group of the user
   */
  experiment?: 'payments_3dspopup_control' | 'payments_3dspopup_variant';
}