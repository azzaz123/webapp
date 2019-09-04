/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Users views item detail screen for an item in Cars category
 */
export interface ViewOthersItemCarDetail {
  /**
   * The unique identifier for an item
   */
  itemId: string;
  /**
   * Identifier of the category that the item belongs to
   */
  categoryId: number;
  /**
   * Item price
   */
  salePrice: number;
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
   * If the seller of the item viewed is a professional user
   */
  isPro: boolean;
  /**
   * Identifier of the screen that the item was viewed from
   */
  screenId: number;
  [k: string]: any;
}
