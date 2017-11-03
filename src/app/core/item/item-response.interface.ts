import { ItemFlags, Image, ItemSaleConditions, Item } from 'shield';

export interface ItemResponse {
  content: ItemContent;
  id: string;
  type: string;
}

export interface ItemContent {
  category_id: number;
  currency_code?: string;
  currency?: string;
  description: string;
  flags: ItemFlags;
  id: string;
  images?: Image[];
  image?: Image;
  modified_date: number;
  sale_conditions: ItemSaleConditions;
  sale_price?: number;
  price?: number;
  seller_id: string;
  title: string;
  url: string;
  web_slug: string;
  favorites?: number;
  views?: number;
}

export interface ItemsData {
  data: Item[];
  init: number;
}

export interface ConversationUser {
  id: string;
  micro_name: string;
  last_message: string;
  image?: Image;
}
