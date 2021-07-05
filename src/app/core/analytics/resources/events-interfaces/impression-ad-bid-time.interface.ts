/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * User views an ad impression (attributes defines start&end of bid time)
 */
export interface ImpressionAdBidTime {
  /**
   * Request result
   */
  result: string;
  /**
   * Request unique identifier - Links with ad creative load request event
   */
  request_id: string;
  /**
   * Epoch time when the request starts
   */
  start_time?: number;
  /**
   * Epoch time when the request ends
   */
  end_time?: number;
  /**
   * Identifier of the adunit where the ad is shown
   */
  AdUnit: string;
  /**
   * Type of connection being used by the device that makes the request
   */
  connection_type?: string;
  /**
   * Identifies the source to which the ad belongs
   */
  advertiser?: string;
}
