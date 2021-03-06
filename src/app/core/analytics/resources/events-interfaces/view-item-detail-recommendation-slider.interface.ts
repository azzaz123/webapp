/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Users view the recommendation slider (with recommendations) in the item detail
 */
export interface ViewItemDetailRecommendationSlider {
  /**
   * Item source for which recommendations are given
   */
  itemSourceId: string;
  /**
   * Identifier of the category that the source item belongs to
   */
  categoryId: number;
  /**
   * Recommendation engine that provides the recommendations
   */
  engine: 'collaborative_filter' | 'more_like_this_solr';
  /**
   * recommended itemids separated by comma
   */
  recommendedItemIds: string;
  /**
   * Identifier of the screen that the item was clicked from
   */
  screenId: 115;
  /**
   * If the source itemid is from a professional user
   */
  isPro: boolean;
  /**
   * Name of the experiment or A/B testing applied to the user who has performed the search. The default value would be 'baseline'
   */
  experiment?: string;
}
