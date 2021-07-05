/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * A non-pro user clicks to edit fields that are reserved for pro accounts
 */
export interface ClickEditProField {
  /**
   * The field the user is trying to edit
   */
  field: 'header photo' | 'description' | 'opening hours' | 'phone' | 'web';
  /**
   * Identifier of the screen
   */
  screenId: 112;
}
