/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * There is a problem or an error with the payment request
 */
export interface TransactionPaymentError {
  /**
   * The unique identifier for an item
   */
  itemId: string;
  /**
   * Balance amount in the wallet
   */
  walletBalanceAmount: number;
  /**
   * Payment method the user has selected
   */
  paymentMethod?: 'bank card' | 'wallet' | 'wallet, bank card' | 'paypal' | 'wallet, paypal';
  /**
   * Short description of the error
   */
  errorType: 'missing or incorrect information' | 'payment failed' | 'cancel payment';
  /**
   * Identifier of the checkout screen
   */
  screenId: 238;
}
