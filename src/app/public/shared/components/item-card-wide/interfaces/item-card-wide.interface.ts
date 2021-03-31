import { ItemFlags, ItemVisibilityFlags } from '@core/item/item-response.interface';
import { Image } from '@core/user/user-response.interface';

export interface ItemCardWide {
  id: string;
  title: string;
  description: string;
  salePrice: number;
  images: Image[];
  flags?: ItemFlags;
  bumpFlags?: ItemVisibilityFlags;
  webSlug: string;
  currencyCode: string;
}
