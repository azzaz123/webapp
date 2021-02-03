/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * User views the section of messages
 */
export interface ViewMessages {
  /**
   * Identifier of my messages section screen
   */
  screenId: 228;
  /**
   * Flag true or false is the view shows an empty state
   */
  emptyState?: boolean;
  /**
   * Number of unread messages the user has in the my messages section
   */
  numberOfUnreadMessages?: number;
  /**
   * Name of the experiment or A/B testing applied to the user who has viewed the section. The default value would be 'baseline'
   */
  experiment?: string;
}
