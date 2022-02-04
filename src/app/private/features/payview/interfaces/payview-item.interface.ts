import { Image, UserLocation } from '@core/user/user-response.interface';
import {
  ItemFlags,
  ItemActions,
  ItemSaleConditions,
  AutorenewPurchase,
  DeliveryInfo,
  ItemExtraInfo,
  KmInfo,
  ItemVisibilityFlags,
} from '@core/item/item-response.interface';

export interface PayviewItem {
  actionsAllowed?: ItemActions;
  bumpExpiringDate?: number;
  bumpFlags?: ItemVisibilityFlags;
  car_info?: KmInfo;
  categoryId?: number;
  conversations?: number;
  currencyCode?: string;
  deliveryInfo?: DeliveryInfo;
  description?: string;
  extraInfo?: ItemExtraInfo;
  favorited?: boolean;
  favorites?: number;
  flags?: ItemFlags;
  hashtags?: string[];
  id?: string;
  images?: Image[];
  itemType?: string;
  km?: number;
  legacyId?: number;
  location?: UserLocation;
  mainImage?: Image;
  modifiedDate?: number;
  notAvailable?: boolean;
  owner?: string;
  publishedDate?: number;
  purchases?: AutorenewPurchase;
  reserved?: boolean;
  saleConditions?: ItemSaleConditions;
  salePrice?: number;
  selected?: boolean;
  sold?: boolean;
  title?: string;
  urgent?: boolean;
  url?: string;
  views?: number;
  webSlug?: string;
}
