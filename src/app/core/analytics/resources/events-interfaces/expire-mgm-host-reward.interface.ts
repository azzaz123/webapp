/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Event triggered by the MGM host when the reward expired because wasn't used in the required time
 */
export interface ExpireMGMHostReward {
  /**
   * Identifier of the guest that has accepted the invitation
   */
  MGMguestUserId: string;
}
