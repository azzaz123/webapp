/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Event triggered by the MGM host or guest when the reward is used in a shipping request
 */
export interface UseMGMReward {
  /**
   * The unique identifier of the reward used
   */
  rewardId: string;
  /**
   * Identifier of the shipping request
   */
  requestId: string;
}
