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
  image?: {
    original: string;
    small: string;
    large: string;
    medium: string;
    xlarge: string;
    original_height: number;
    original_width: number;
  };
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

export interface Purchase {
  expiration_date: number;
  item_id: string;
  visibility_flags: {
    bumped: boolean;
    highlighted: boolean;
    urgent: boolean;
  };
}

export interface Product {
  id: string;
  name: string;
  default_duration_index: number;
  durations: Duration[];
}

export interface Duration {
  id: string;
  duration: number;
  market_code: string;
  original_market_code: string;
}

export interface SelectedItemsAction {
  id: string;
  action: 'selected' | 'deselected';
}

export interface Order {
  item_id: string;
  product_id: string;
}
