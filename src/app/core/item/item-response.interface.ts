import { ItemFlags, Image, ItemSaleConditions, Item, DeliveryInfo } from 'shield';

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
  sale_conditions?: ItemSaleConditions;
  sale_price?: number;
  price?: number;
  seller_id: string;
  title: string;
  url?: string;
  web_slug: string;
  favorites?: number;
  views?: number;
  delivery_info?: DeliveryInfo;
}

export interface CarContent extends ItemContent {
  brand?: string;
  model?: string;
  year?: number;
  km?: number;
  gearbox?: string;
  engine?: string;
  color?: string;
  horsepower?: number;
  body_type?: string;
  num_doors?: number;
  extras?: any[];
  storytelling?: string;
  warranty?: false;
  num_seats?: number;
  condition?: string;
  version?: string;
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

export interface AvailableProductsResponse {
  default_product_id: string;
  products: Product[];
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

export interface ItemUploadForm {
  category_id: string;
  images: any[];
  title: string;
  sale_price: number;
  currency_code: string;
  description?: string;
  sale_conditions: {
    fix_price: boolean;
    exchange_allowed: boolean;
    shipping_allowed?: boolean;
  };
  delivery_info?: any;
  location?: {
    address: string;
    latitude: number;
    longitude: number;
  };
}

export interface CarUploadForm extends ItemUploadForm {
  model: string;
  brand: string;
  year: string;
  version: string;
  num_seats: number;
  body_type: string;
  km: number;
  storytelling: string;
  engine: string;
  gearbox: string;
  id?: string;
}

export interface ItemsWithAvailableProductsResponse extends ItemResponse {
  productList: Product[];
}

export interface ProductDurations {
  [duration: string]: {
    citybump: Duration;
    zonebump: Duration;
    countrybump: Duration;
  };
}

export interface ItemWithProducts {
  item: Item;
  products: ProductDurations;
}


