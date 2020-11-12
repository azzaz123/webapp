/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * User clicks on the Banned User Pop Up CLOSE button (or outside the pop up) to close it and see the actual conversation
 */
export interface ClickBannedUserChatPopUpCloseButton {
  /**
   * Identifier of the user that performs the action
   */
  userId: string;
  /**
   * Identifier of the banned user / interlocutor
   */
  bannedUserId: string;
  /**
   * Identifier of the conversation
   */
  conversationId: string;
  /**
   * Identifier of Banned User Chat Pop Up screen view
   */
  screenId: 229;
}
