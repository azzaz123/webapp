/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Buyer sends first conversation message
 */
export interface SendFirstMessage {
  /**
   * The unique identifier for an item
   */
  itemId: string;
  /**
   * Identifier of the category that the item belongs to
   */
  categoryId: number;
  /**
   * Identifier of the user that the item belongs to
   */
  sellerUserId: string;
  /**
   * Identifier of the conversation
   */
  conversationId: string;
  /**
   * The unique identifier of the search that the chat is under
   */
  searchId?: string;
  /**
   * Identifier of the screen from which the message was sent from
   */
  screenId: 27;
  /**
   * If the item is a bumped item
   */
  isBumped?: boolean;
  /**
   * If the item is from a professional user
   */
  isPro?: boolean;
}
