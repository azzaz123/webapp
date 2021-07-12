/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Users click on item card displayed in different screens
 */
export interface ClickItemCard {
  /**
   * The unique identifier for an item
   */
  itemId: string;
  /**
   * Identifier of the category that the item belongs to
   */
  categoryId: number;
  /**
   * Index of the item displayed in the screen
   */
  position: number;
  /**
   * Name of the experiment or A/B testing applied to the user who click the item. The default value would be 'baseline'
   */
  experiment?: string;
  /**
   * The unique identifier of the search that the click is under
   */
  searchId?: string;
  /**
   * Identifier of the screen that the item was clicked from
   */
  screenId: 110 | 111 | 29 | 187 | 188 | 140 | 190 | 194 | 210 | 214 | 217 | 219;
  /**
   * If the item clicked is from a professional user
   */
  isPro?: boolean;
  /**
   * Item price
   */
  salePrice: number;
  /**
   * Item title
   */
  title: string;
  /**
   * Identifier of the source item for which recommendations have been given
   */
  itemSourceRecommendationId?: string;
  /**
   * The distance in km from the location where the search is performed and the location of the item clicked
   */
  itemDistance?: number;
  /**
   * If the listing has shipping allowed
   */
  shippingAllowed?: boolean;
  /**
   * Identifier of the user that the item belongs to
   */
  sellerUserId?: string;
  /**
   * If the item clicked is a bumped item
   */
  isBumped: boolean;
  /**
   * When the event is triggered in SavedSearchesNewVsOld screen (217), specify if it is in the 'new' results or 'old'
   */
  savedSearchResults?: string;
  /**
   * Used in the case of having more than one section in the landings to specify what type of landing it is
   */
  seoSection?: string;
  /**
   * If the item clicked is inside the bump slider
   */
  isBumpSlider?: boolean;
  /**
   * If the item clicked is inside the pros slider
   */
  isProSlider?: boolean;
}
