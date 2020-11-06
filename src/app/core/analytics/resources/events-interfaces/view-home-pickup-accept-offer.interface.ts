/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Seller views Accept Offer screen with or without the home pickup option available
 */
export interface ViewHomePickupAcceptOffer {
  /**
   * The unique identifier for an item
   */
  itemId: string;
  /**
   * Identifier of the user interested in the item
   */
  buyerUserId: string;
  /**
   * Identifier of the transaction request
   */
  requestId: string;
  /**
   * If the user is in the experiment Shipping Home Pickup, the value is shipping_home_pickup_experiment or baseline. If it's not, the value is empty string
   */
  experiment: string;
  /**
   * Identifier of the Accept Offer screen
   */
  screenId: 210;
}