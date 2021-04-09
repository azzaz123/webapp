import { ItemFlags, ItemSaleConditions, ItemVisibilityFlags } from '@core/item/item-response.interface';
import { Image } from '@core/user/user-response.interface';

export interface ItemCard {
  id: string;
  title: string;
  description?: string;
  salePrice: number;
  currencyCode: string;
  ownerId: string;
  webSlug: string;
  images: Image[];
  flags?: ItemFlags;
  bumpFlags?: ItemVisibilityFlags;
  categoryId?: number;
  saleConditions?: ItemSaleConditions;
}
