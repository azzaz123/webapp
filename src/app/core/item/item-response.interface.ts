import { ItemFlags, Image, ItemSaleConditions } from 'shield';

export interface ItemResponse {
  content: ItemContent;
  id: string;
  type: string;
}

export interface ItemContent {
  category_id: number;
  currency_code: string;
  description: string;
  flags: ItemFlags;
  id: string;
  images: Image[];
  modified_date: number;
  sale_conditions: ItemSaleConditions;
  sale_price: number;
  seller_id: string;
  title: string;
  url: string;
}


/*

 owner: string;
 location: Location;
 actions_allowed: ItemActions;
 main_image: Image;
 web_slug: string;
 published_date: number;

 */
