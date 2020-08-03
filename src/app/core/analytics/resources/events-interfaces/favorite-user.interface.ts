/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * User favorites another user
 */
export interface FavoriteUser {
  /**
   * Identifier of the screen that the user was favorited from
   */
  screenId: 115 | 188 | 214 | 29;
  /**
   * If the user favorited is a professional user
   */
  isPro?: boolean;
  /**
   * Identifier of the user that is favorited
   */
  sellerUserId: string;
}