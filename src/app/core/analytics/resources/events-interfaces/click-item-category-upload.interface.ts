/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Users clicks on the category when uploading an item (first screen shown)
 */
export interface ClickItemCategoryUpload {
  /**
   * Identifier of the category clicked
   */
  categoryId: number;
  /**
   * Identifier of the upload screen
   */
  screenId: 41 | 160;
  /**
   * Name of the experiment or A/B testing applied to the user who is uploading the item. The default value would be 'baseline'
   */
  experiment?: string;
  /**
   * If the click is from a professional user
   */
  isPro?: boolean;
}
