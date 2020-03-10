/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * User clicks on promocard banner
 */
export interface ClickPromocardBanner {
  /**
   * Identifier of the campaign that the ad belongs to
   */
  lineitem_id: string;
  /**
   * Identifier of the category where the ad is shown
   */
  category_id?: string;
}
