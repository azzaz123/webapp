/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * User views a Banned User Pop Up in chat conversations when the other user has been banned (but only for some specific reasons: FRAUD, NOT_TRUSTED, SCAMMER, SPAMMER)
 */
export interface ViewBannedUserChatPopUp {
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
