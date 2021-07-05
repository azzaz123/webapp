/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * View Open Web
 */
export interface ViewOpenWeb {
  /**
   * Url of the current page that the user is visiting
   */
  currentUrl: string;
  /**
   * Url from where the user has reached the current_url
   */
  refererUrl: string;
  /**
   * Identify the category of the landing seo
   */
  category?: string;
  /**
   * Identify the keywords of the landing seo
   */
  keyword?: string;
  /**
   * Identify if the landing is item or not
   */
  item?: string;
  /**
   * Identify the province of the landing seo
   */
  province?: string;
  /**
   * Identify the city of the landing seo
   */
  city?: string;
  /**
   * Identifies the A/B variation to which the user belongs when they do the event
   */
  experiment?: string;
  /**
   * Identifier of any landing SEO screen
   */
  screenId: 193 | 115 | 29 | 111 | 216;
}
