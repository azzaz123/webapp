/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Buyer views QR code to show it to seller for P2P payment
 */
export interface ViewP2PQRCode {
  /**
   * Identifier of QR code screen
   */
  screenId: 277;
  /**
   * Amount the user wants to pay
   */
  paymentAmount: number;
  /**
   * Hashed Id of the item
   */
  itemId?: string;
}
