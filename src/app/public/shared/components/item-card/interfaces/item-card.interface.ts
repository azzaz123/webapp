import { ItemFlags, ItemVisibilityFlags } from '@core/item/item-response.interface';
import { Image } from '@core/user/user-response.interface';

export interface ItemCard {
  title: string;
  description: string;
  salePrice: number;
  mainImage: Image;
  flags: ItemFlags;
  bumpFlags: ItemVisibilityFlags;
}
