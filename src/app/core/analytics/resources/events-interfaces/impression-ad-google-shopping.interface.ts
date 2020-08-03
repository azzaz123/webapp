/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * User views the google shopping section
 */
export interface ImpressionAdGoogleShopping {
  /**
   * Item identifier to the item detail where the ad is displayed
   */
  itemId?: string;
  /**
   * Identifier of the screen where google shopping ad is displayed
   */
  screenId: 115;
  /**
   * Number of ads requested to GShopping
   */
  adsRequested?: number;
  /**
   * Number of ads received by GShopping
   */
  adsReceived?: number;
}