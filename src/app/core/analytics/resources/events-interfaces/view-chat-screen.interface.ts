/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Users view chat screen
 */
export interface ViewChatScreen {
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
   * Identifier of the conversation
   */
  conversationId: string;
  /**
   * Identifier of the screen from which the message was sent from
   */
  screenId: 27;
  /**
   * If the item has the shipping toggle ON and a shipping weight informed
   */
  shippingAllowed?: boolean;
  /**
   * Chat has the option to be translated
   */
  translationAllowed: boolean;
}
