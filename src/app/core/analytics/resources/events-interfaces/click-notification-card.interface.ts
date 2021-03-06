/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Users click on a notification card displayed in the notification center
 */
export interface ClickNotificationCard {
  /**
   * The unique identifier for an item. Only applies to some notification types.
   */
  itemId?: string;
  /**
   * Identifier of the screen that the notification was clicked from
   */
  screenId: 218;
  /**
   * Identifier of the user that the item belongs to. Only applies to some notification types.
   */
  sellerUserId?: string;
  /**
   * Type of the notification that is clicked
   */
  notificationType: string;
  /**
   * If the notification clicked is pinned at the top of the list
   */
  isPinned: boolean;
  /**
   * If the notification clicked is unread
   */
  isUnread: boolean;
}
