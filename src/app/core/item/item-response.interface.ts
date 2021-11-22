import { User } from '@core/user/user';
import { ItemObjectType } from '@private/features/upload/core/models/brand-model.interface';
import { ApiResponse } from '../resource/api-response.interface';
import { Image, UserLocation } from '../user/user-response.interface';
import { Item } from './item';
import { ItemCondition } from './item-condition';

export interface ItemResponseV2 extends ApiResponse {
  title: string;
  description: string;
  owner: string;
  category_id: number;
  location: UserLocation;
  sale_price: number;
  currency_code: string;
  modified_date: number;
  url: string;
  flags: ItemFlags;
  actions_allowed: ItemActions;
  sale_conditions: ItemSaleConditions;
  main_image: Image;
  images: Image[];
  web_slug: string;
  published_date: number;
  delivery_info?: DeliveryInfo;
}

interface BaseUpdateItemResponse {
  id: string;
  type: string;
}

export interface ItemResponse extends BaseUpdateItemResponse {
  content: ItemContent;
}

export interface CarResponse extends BaseUpdateItemResponse {
  content: CarContent;
}

export interface RealEstateResponse extends BaseUpdateItemResponse {
  content: RealestateContent;
}

export interface ItemContent {
  category_id?: number;
  conversations?: number;
  currency_code?: string;
  currency?: string;
  description: string;
  flags: ItemFlags;
  id: string;
  images?: Image[];
  image?: ItemImagesURLs;
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
  extra_info?: ItemExtraInfo;
  visibility_flags?: ItemVisibilityFlags;
  publish_date?: number;
  km?: number;
  user?: User;
  hashtags?: string[];
}

export interface ItemImagesURLs {
  original: string;
  small: string;
  large: string;
  medium: string;
  xlarge: string;
  original_height: number;
  original_width: number;
}

export interface ItemProResponse {
  content: ItemProContent;
  id: string;
  type: string;
}

export interface ItemVisibilityFlags {
  bumped: boolean;
  highlighted: boolean;
  urgent: boolean;
  country_bumped: boolean;
  boosted: boolean;
}

export interface ItemProContent extends ItemContent {
  conversations: number;
  publish_date: number;
  purchases: AutorenewPurchase;
  km?: number;
}

export interface AutorenewPurchase {
  bump_type: string;
  expiration_date: number;
  scheduled_bump_type?: string;
  scheduled_end_date?: number;
  scheduled_start_date?: number;
}

export interface KmInfo {
  km: number;
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
  warranty?: boolean;
  num_seats?: number;
  condition?: string;
  version?: string;
  financed_price?: number;
}

export interface RealestateContent extends ItemContent {
  operation?: string;
  type?: string;
  condition?: string;
  surface?: number;
  bathrooms?: number;
  rooms?: number;
  garage?: boolean;
  terrace?: boolean;
  elevator?: boolean;
  pool?: boolean;
  garden?: boolean;
  storytelling?: string;
  location?: any;
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
  purchase_name?: 'listingfee' | 'countrybump';
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

export interface OrderPro {
  item_id: string;
  start_date: number;
  end_date: number;
  autorenew: boolean;
  bump: boolean;
  national: boolean;
}

export interface ItemUploadForm {
  category_id: string;
  images: any[];
  title: string;
  sale_price: number;
  currency_code: string;
  description?: string;
  sale_conditions?: ItemSaleConditions;
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
  financed_price: number;
  num_seats: number;
  num_doors: number;
  body_type: string;
  km: number;
  storytelling: string;
  engine: string;
  gearbox: string;
  horsepower: number;
  id?: string;
}

export interface RealEstateUploadForm extends ItemUploadForm {
  storytelling: string;
  operation: string;
  type: string;
  condition: string;
  surface: number;
  rooms: number;
  bathrooms: number;
  garage: boolean;
  terrace: boolean;
  elevator: boolean;
  pool: boolean;
  garden: boolean;
  location?: {
    address: string;
    latitude: number;
    longitude: number;
    approximated_location: boolean;
  };
  id?: string;
}

export interface ItemsWithAvailableProductsResponse extends ItemResponse {
  productList: Product[];
}

export interface ProductDurations {
  [duration: string]: {
    citybump?: Duration;
    zonebump: Duration;
    countrybump: Duration;
  };
}

export interface ItemWithProducts {
  item: Item;
  products: ProductDurations;
}

export interface CheapestProducts {
  [itemId: string]: string;
}

export interface AllowedActionResponse {
  type: string;
  allowed: boolean;
  cause?: string;
}

export interface ItemFlags {
  pending: boolean;
  sold: boolean;
  favorite?: boolean;
  reserved: boolean;
  removed?: boolean;
  banned: boolean;
  expired: boolean;
  review_done?: boolean;
  bumped?: boolean;
  highlighted?: boolean;
  urgent?: boolean;
  bump_type?: string;
  onhold?: boolean;
  notAvailable?: boolean;
}

export interface ItemActions {
  chat: boolean;
  share: boolean;
  check_profile: boolean;
  report: boolean;
  favorite: boolean;
  visible: boolean;
  edit: boolean;
  reserve: boolean;
  sell: boolean;
  delete: boolean;
}

export interface ItemSaleConditions {
  fix_price: boolean;
  exchange_allowed: boolean;
  shipping_allowed?: boolean;
  supports_shipping?: boolean;
}

export interface ItemCounters {
  views: number;
  favorites: number;
  conversations: number;
}

export interface ItemBulkResponse {
  updatedIds: string[];
  failedIds: string[];
}

export interface ItemsStore {
  active: Item[];
  sold: Item[];
  pending: Item[];
  featured?: Item[];
}

export interface DeliveryInfo {
  max_weight_kg: number;
  min_weight_kg: number;
}

export interface ItemExtraInfo {
  object_type?: ItemObjectType;
  brand?: string;
  model?: string;
  gender?: string;
  size?: {
    id: string;
    text?: string;
  };
  condition?: ItemCondition;
}

export interface ItemDataResponse {
  count: number;
  data: Item;
}

export interface LatestItemResponse {
  count: number;
  items: ItemResponse[];
}

export interface PurchaseProductsWithCreditsResponse {
  payment_needed: boolean;
  items_failed: string[];
}

export interface CarInfo {
  body_type: string;
  brand: string;
  engine: string;
  gearbox: string;
  horsepower: number;
  model: string;
  num_doors: number;
  num_seats: number;
  version: string;
}

export interface ListingFeeProductInfo {
  limit_category: number;
  limit_type: string;
  product_group: AvailableProductsResponse;
}
