import { ItemFlags, ItemVisibilityFlags } from '@core/item/item-response.interface';
import { Image } from '@core/user/user-response.interface';

export interface ItemCard {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  salePrice: number;
  mainImage: Image;
  flags: ItemFlags;
  bumpFlags: ItemVisibilityFlags;
  webSlug: string;
}
