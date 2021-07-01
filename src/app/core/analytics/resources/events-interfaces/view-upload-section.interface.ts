/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * User views the section of Upload
 */
export interface ViewUploadSection {
  /**
   * Identifier of the upload section screen
   */
  screenId: 41;
  /**
   * Flag true or false is the view shows an empty state
   */
  emptyState?: boolean;
  /**
   * Name of the experiment or A/B testing applied to the user who has viewed the favorite items section.
   */
  experiment?: string;
}
