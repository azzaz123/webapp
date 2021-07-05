/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * User uploads a car
 */
export interface ListItemCar {
  /**
   * The unique identifier for an item
   */
  itemId: string;
  /**
   * Identifier of the category that the item belongs to
   */
  categoryId: number;
  /**
   * Identifier of the subcategory that the item belongs to
   */
  subcategoryId?: number;
  /**
   * Item price
   */
  salePrice: number;
  /**
   * Item title
   */
  title?: string;
  /**
   * Car Brand
   */
  brand?: string;
  /**
   * Car Model
   */
  model?: string;
  /**
   * Car Year
   */
  year?: number;
  /**
   * Car km
   */
  km?: number;
  /**
   * Car gearbox
   */
  gearbox?: string;
  /**
   * Car Engine
   */
  engine?: string;
  /**
   * Car Colour
   */
  colour?: string;
  /**
   * Car horse power
   */
  hp?: number;
  /**
   * Car number of doors
   */
  numDoors?: number;
  /**
   * Car Bodytype
   */
  bodyType?: string;
  /**
   * If the item uploaded is from a cardealer
   */
  isCarDealer?: boolean;
  /**
   * If the item uploaded is from a professional user
   */
  isPro: boolean;
  /**
   * Identifier of the screen that the item was uploaded from
   */
  screenId: number;
  /**
   * Hashtags
   */
  hashtags?: string;
}
