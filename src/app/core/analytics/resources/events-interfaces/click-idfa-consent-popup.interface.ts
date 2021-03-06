/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * User clicks on IDFA consent popup
 */
export interface ClickIDFAConsentPopup {
  /**
   * If the user allows idfa tracking
   */
  isAllowed?: boolean;
  /**
   * Identifier of the screen that the popup was clicked from
   */
  screenId: 110;
  /**
   * Name of the experiment or A/B testing applied to the user who has performed the click. The default value would be 'baseline'
   */
  experiment?: string;
}
