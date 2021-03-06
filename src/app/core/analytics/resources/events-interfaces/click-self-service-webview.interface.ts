/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * User clicks in self service webview
 */
export interface ClickSelfServiceWebview {
  /**
   * Identifier of the screen where is the error
   */
  screenId: 325;
  /**
   * Field if the webview was already loaded
   */
  loadSuccess: boolean;
  /**
   * Url loaded in the webview
   */
  urlLoaded?: string;
  /**
   * Original url loaded received from backend
   */
  originalUrl?: string;
  /**
   * Identifier of the transaction
   */
  transactionId?: string;
  /**
   * Identifier of the delivery tag provided by the carrier
   */
  deliveryTag?: string;
  /**
   * Message of the dispute webview error
   */
  errorMessage?: string;
}
