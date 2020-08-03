/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Didomi SDK emits onReady callback
 */
export interface CallbackDidomiOnReadyTime {
  /**
   * Request result
   */
  result: string;
  /**
   * Epoch time when the request starts
   */
  start_time: number;
  /**
   * Epoch time when the request ends
   */
  end_time: number;
  /**
   * Identifier of the screen that the impression was showed from
   */
  screenId: 110;
}