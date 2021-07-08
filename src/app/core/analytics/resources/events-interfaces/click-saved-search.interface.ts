/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * User clicks a saved search
 */
export interface ClickSavedSearch {
  /**
   * The unique identifier of the saved search
   */
  savedSearchId: string;
  /**
   * Identifier of the screen where the saved search has been clicked
   */
  screenId: 224;
  /**
   * Latitude of the performed search
   */
  latitude?: number;
  /**
   * Latitude of the performed search
   */
  longitude?: number;
  /**
   * Identifier of the category that has been filtered in the saved search
   */
  categoryId?: number;
  /**
   * Keywords applied in the saved search
   */
  keywords?: string;
  /**
   * Minimum price set as a filter in the saved search
   */
  minPrice?: number;
  /**
   * Maximum price set as a filter in the saved search
   */
  maxPrice?: number;
  /**
   * Distance in km set as a filter in the saved search
   */
  distance?: number;
  /**
   * Order criteria in which the results of the saved search are shown
   */
  orderBy: "distance" | "price_low_to_high" | "price_high_to_low" | "newest" | "most_relevant";
  professional?: boolean;
  shipping?: boolean;
  exchange?: boolean;
  urgent?: boolean;
  timeFilter?: "today" | "lastWeek" | "lastMonth";
  minKm?: number;
  maxKm?: number;
  minYear?: number;
  maxYear?: number;
  minNumSeats?: number;
  maxNumSeats?: number;
  bodyType?: string;
  warranty?: boolean;
  minHorsePower?: number;
  maxHorsePower?: number;
  minNumDoors?: number;
  maxNumDoors?: number;
  engine?: string;
  gearbox?: string;
  carBrand?: string;
  carModel?: string;
  operation?: "buy" | "rent";
  propertyType?: "box_room" | "apartment" | "room" | "garage" | "office" | "house" | "land";
  minSurface?: number;
  maxSurface?: number;
  rooms?: number;
  bathrooms?: number;
  elevator?: boolean;
  terrace?: boolean;
  pool?: boolean;
  garden?: boolean;
  garage?: boolean;
  condition?: "to_reform" | "new_construction" | "mint";
  objectTypeId?: number;
  brandModel?: string;
  size?: string;
  gender?: "female" | "male";
  /**
   * Item condition set as a filter in the saved search
   */
  itemCondition?: string;
  /**
   * Number of hits the saved search has
   */
  numberOfHits?: number;
  /**
   * If the saved search is active
   */
  isActive?: boolean;
}
